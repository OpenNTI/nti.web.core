/** @typedef {string} Property */
/** @typedef {Property|Property[]} PropertyList */
/** @typedef {() => void} Listener */
/** @typedef {() => void} Unsubscribe */

/**
 * A utility class for listening for particular properties to change
 *
 * @abstract
 */
export default class PropertyChangeEmitter {
	/**
	 * Define properties (typically derived) that depend on the
	 * value of other properties.
	 *
	 * Ex:
	 *
	 * ```javascript
	 * class List extends PropertyChangeEmitter {
	 * 	static DependentProperties = {size: ['items']};
	 *
	 * 	get size () {
	 * 		return this.items.size;
	 * 	}
	 *
	 * 	setItems (items) {
	 * 		this.items = items;
	 * 		this.onChange('items');
	 * 	}
	 * }
	 * ```
	 *
	 * @type {{Property: PropertyList}}
	 */
	static DependentProperties = {};

	#listeners = new Map();
	#sourceProperties = new Map();

	constructor() {
		//Setup the static DependentProperties
		for (let [property, dependsOn] of Object.entries(
			this.constructor.DependentProperties
		)) {
			this.addDependentProperty(property, dependsOn);
		}
	}

	/**
	 * Add a property that depends on the given set
	 *
	 * @param {Property} property
	 * @param {PropertyList} dependsOn
	 */
	addDependentProperty(property, dependsOn = []) {
		const sources = Array.isArray(dependsOn) ? dependsOn : [dependsOn];

		sources.forEach(s => {
			if (!this.#sourceProperties.has(s)) {
				this.#sourceProperties.set(s, new Set());
			}

			this.#sourceProperties.get(s).add(property);
		});
	}

	/**
	 * Expand a changed set to contain all dependent properties
	 *
	 * @param {PropertyList} who
	 * @returns {Set<Property>}
	 */
	getChangedSet(who) {
		const buildSet = (props, set) => {
			for (let prop of props) {
				if (Array.isArray(prop)) {
					buildSet(prop, set);
					continue;
				}

				set.add(prop);

				const dependents = this.#sourceProperties.get(prop);

				if (dependents) {
					buildSet([...dependents], set);
				}
			}

			return set;
		};

		return buildSet(who, new Set());
	}

	/**
	 * Trigger all the listeners for the given properties
	 *
	 * @param  {...PropertyList} who properties that changed
	 */
	onChange(...who) {
		const changed = this.getChangedSet(who);

		const listeners = new Set(
			[...changed].reduce((acc, prop) => {
				const propListeners = this.#listeners.get(prop);

				return [...acc, ...(propListeners ?? [])];
			}, [])
		);

		listeners.forEach(l => l());
	}

	/**
	 * Add a callback for when a property changes
	 *
	 * @param {PropertyList} property properties to listen to
	 * @param {Listener} fn function to callback when one of the keys change
	 * @returns {Unsubscribe} callback to remove listener
	 */
	subscribeToProperties(property, fn) {
		if (Array.isArray(property)) {
			const cleanups = property.map(p =>
				this.subscribeToProperties(p, fn)
			);

			return () => cleanups.forEach(c => c());
		}

		if (!this.#listeners.has(property)) {
			this.#listeners.set(property, new Set());
		}

		this.#listeners.get(property).add(fn);

		return () => {
			const existing = this.#listeners.get(property);

			existing.delete(fn);

			if (existing.size === 0) {
				this.#listeners.delete(property);
			}
		};
	}
}
