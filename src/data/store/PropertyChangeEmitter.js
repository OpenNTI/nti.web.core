export default class PropertyChangeEmitter {
	static DependentProperties = {};

	#listeners = new Map();
	#sourceProperties = new Map();

	constructor() {
		for (let [dependent, sources] of Object.entries(
			this.constructor.DependentProperties
		)) {
			this.addDependentProperty(dependent, sources);
		}
	}

	addDependentProperty(property, dependsOn = []) {
		const sources = Array.isArray(dependsOn) ? dependsOn : [dependsOn];

		sources.forEach(s => {
			if (!this.#sourceProperties.has(s)) {
				this.#sourceProperties.set(s, new Set());
			}

			this.#sourceProperties.get(s).add(property);
		});
	}

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

	subscribe(key, fn) {
		if (Array.isArray(key)) {
			const cleanups = key.map(k => this.subscribe(k, fn));

			return () => cleanups.forEach(c => c());
		}

		if (!this.#listeners.has(key)) {
			this.#listeners.set(key, new Set());
		}

		this.#listeners.get(key).add(fn);

		return () => {
			const existing = this.#listeners.get(key);

			existing.delete(fn);

			if (existing.size === 0) {
				this.#listeners.delete(key);
			}
		};
	}
}
