import { Promises } from '@nti/lib-commons';

// import {useStore} from '../hooks/use-store';
// import {useRead} from '../hooks/use-read';
// import {useProperties} from '../hooks/use-properties';

import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';

const LifeCycles = ['load', 'unload'];

export default class DataStore extends PropertyChangeEmitter {
	static Action = Action;

	constructor() {
		super();

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
		this.addDependentProperty('reader', ['load']);

		this.addDependentProperty('loading', 'load');
		this.addDependentProperty('loaded', 'load');

		this.addDependentProperty('unloading', 'unload');
		this.addDependentProperty('unloaded', 'unload');
	}

	#reader = null;
	read() {
		if (!this.#reader) {
			const loaded = new Promise((fulfill, reject) => {
				let cleanup = null;

				if (this.load.hasRun) {
					fulfill(this);
				}

				cleanup = this.subscribeToProperties('load', () => {
					if (this.load.error) {
						reject(this.load.error);
						cleanup?.();
					} else if (this.load.hasRun) {
						fulfill(this);
						cleanup?.();
					}
				});

				if (!this.load.hasRun) {
					this.#load();
				}
			});

			this.#reader = Promises.toReader(loaded);
		}

		return this.#reader.read();
	}

	//#region Life Cycles

	#reload() {
		if (this.load.hasRun) {
			this.#load();
		}
	}

	#loadAbortController = null;
	#loadTimeout = null;
	#load() {
		this.#loadAbortController?.abort();
		this.#loadAbortController = null;

		if (!this.#loadTimeout) {
			this.#loadTimeout = setTimeout(() => {
				this.#loadAbortController = new AbortController();
				this.load(this.#params, this.#loadAbortController);
				this.#loadTimeout = null;
			}, 1);
		}
	}

	load() {}
	get loading() {
		return this.load.running;
	}
	get loaded() {
		return this.load.hasRun;
	}

	initialLoad() {
		if (!this.load.hasRun) {
			this.#load();
		}
	}

	unload() {}
	get unloading() {
		return this.unload.running;
	}
	get unloaded() {
		return this.unload.hasRun;
	}
	//#endregion

	//#region State
	#state = {};

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

	//#region Param
	#params = {};

	setParams(params = {}) {
		const changed = Object.entries(params).some(
			param => this.#params[param[0]] !== params[1]
		);

		this.#params = {
			...this.#params,
			...params,
		};

		if (changed) {
			this.#reload();
		}
	}
	//#endregion
}
