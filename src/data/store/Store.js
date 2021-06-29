import React from 'react';

import { Promises } from '@nti/lib-commons';

import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';

const LifeCycles = ['initialize', 'reload', 'load', 'cleanup'];

const Load = Symbol('Load');
const Key = Symbol('key');
const Instances = Symbol('Instances');

function StoreInstanceReducer(state, action) {
	if (action.type === 'update') {
		return { store: action.store };
	}

	return state;
}

export default class DataStore extends PropertyChangeEmitter {
	static Action = Action;

	static getStore(key) {
		const Store = this;

		if (!key) {
			return new Store();
		}

		this[Instances] = this[Instances] || new Map();

		if (!this[Instances].has(key)) {
			this[Instances].set(key, {
				count: 0,
				store: new Store(key),
			});
		}

		const { store, count } = this[Instances].get(key);

		this[Instances].set(key, { count: count + 1, store });

		return store;
	}

	static freeStore(key) {
		if (!this[Instances].has(key)) {
			return;
		}

		const { store, count } = this[Instances].get(key);

		if (count <= 1) {
			this[Instances].delete(key);
			store.cleanup();
		} else {
			this[Instances].set(key, { count: count - 1, store });
		}
	}

	static useStore(key) {
		const getStore = k => this.getStore(k);
		const freeStore = k => this.freeStore(k);

		const [{ store }, dispatch] = React.useReducer(
			StoreInstanceReducer,
			key,
			initialKey => ({ store: getStore(initialKey) })
		);

		React.useEffect(() => {
			const newStore = store[Key] === key ? store : getStore(key);

			if (newStore !== store) {
				dispatch({ type: 'update', store: newStore });
			}

			return () => freeStore(key);
		}, [key]);

		return store;
	}

	#state = {};

	constructor(storeKey) {
		super();

		this[Key] = storeKey;

		const binding = key => ({
			scope: this,

			onUpdate: (...args) => this.updateState(...args),
			onStart: () => this.onChange(key),
			onError: () => this.onChange(key),
			onFinish: () => this.onChange(key),
		});

		for (let [key, value] of Object.entries(this)) {
			if (LifeCycles.included(key) && value.bindStore) {
				throw new Error('DataStore life-cycles cannot be actions');
			}

			if (value.bindStore) {
				Object.defineProperty(this, key, value.bindStore(binding(key)));
			}
		}

		for (let cycle of LifeCycles) {
			this[cycle] = Action(this[cycle]).bindStore(binding(cycle));
		}

		//Set these up in the constructor, so they cannot be overridden
		this.addDependentProperty('reader', ['initialize', 'load']);

		this.addDependentProperty('initializing', 'initialize');
		this.addDependentProperty('initialized', 'initialize');

		this.addDependentProperty('reloading', 'reload');

		this.addDependentProperty('loading', 'load');
		this.addDependentProperty('loaded', 'load');

		this.addDependentProperty('cleaningup', 'cleanup');
		this.addDependentProperty('cleanedup', 'cleanup');

		this.initialize();
	}

	//#region Life Cycles
	#loadAbortController = null;
	#loadTimeout = null;
	[Load]() {
		if (this.#loadAbortController) {
			this.#loadAbortController.abort();
		}

		if (!this.#loadTimeout) {
			this.#loadTimeout = setTimeout(() => {
				this.#loadAbortController = new AbortController();
				this.load(this.#loadAbortController);
				this.#loadTimeout = null;
			}, 0);
		}
	}

	#reader = null;
	read() {
		if (!this.#reader) {
			const loaded = new Promise((fulfill, reject) => {
				let cleanup = null;

				if (this.load.hasRan) {
					fulfill(this);
				}

				cleanup = this.subscribeToProperties('load', () => {
					if (this.load.hasRan) {
						fulfill(this);
						cleanup?.();
					}
					if (this.load.error) {
						reject(this);
						cleanup?.();
					}
				});

				if (!this.load.hasRan) {
					this[Load]();
				}
			});

			this.#reader = Promises.toReader(loaded);
		}

		return this.#reader;
	}

	initialize() {}
	get initializing() {
		return !this.initialize.hasRan && this.initialize.running;
	}
	get initialized() {
		return this.initialize.hasRan;
	}

	reload() {}
	get reloading() {
		return this.reloading.running;
	}

	load() {}
	get loading() {
		return this.load.running;
	}
	get loaded() {
		return this.load.hasRan;
	}

	cleanup() {}
	get cleaningup() {
		return this.cleanup.running;
	}
	get cleanedup() {
		return this.cleanup.hasRan;
	}
	//#endregion

	//#region State Updating
	updateState(newState) {
		const updated = Object.keys(newState);
		const merged = this.mergeState(newState, this.#state);

		this.#state = merged;

		this.onChange(updated);
	}

	mergeState(newState, prevState) {
		return { ...prevState, ...newState };
	}
	//#endregion
}
