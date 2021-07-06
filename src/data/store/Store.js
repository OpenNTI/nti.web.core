import { Promises } from '@nti/lib-commons';

import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';

const LifeCycles = ['initialize', 'reload', 'load', 'cleanup'];

export default class DataStore extends PropertyChangeEmitter {
	static Action = Action;

	constructor(storeKey) {
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

	#reader = null;
	read() {
		if (!this.#reader) {
			const loaded = new Promise((fulfill, reject) => {
				let cleanup = null;

				if (this.load.hasRun) {
					fulfill(this);
				}

				cleanup = this.subscribeToProperties('load', () => {
					if (this.load.hasRun) {
						fulfill(this);
						cleanup?.();
					}
					if (this.load.error) {
						reject(this.load.error);
						cleanup?.();
					}
				});

				if (!this.load.hasRun) {
					this.#load();
				}
			});

			this.#reader = Promises.toReader(loaded);
		}

		return this.#reader;
	}

	//#region Life Cycles
	initialize() {}
	get initializing() {
		return !this.initialize.hasRun && this.initialize.running;
	}
	get initialized() {
		return this.initialize.hasRun;
	}

	#reload() {
		if (this.load.hasRun) {
			this.#load;
		}
	}

	reload() {}
	get reloading() {
		return this.reloading.running;
	}

	#loadAbortController = null;
	#loadTimeout = null;
	#load() {
		if (this.#loadAbortController) {
			this.#loadAbortController.abort();
		}

		if (!this.#loadTimeout) {
			this.#loadTimeout = setTimeout(() => {
				this.#loadAbortController = new AbortController();
				this.load(this.#params, this.#loadAbortController);
				this.#loadTimeout = null;
			}, 0);
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

	cleanup() {}
	get cleaningup() {
		return this.cleanup.running;
	}
	get cleanedup() {
		return this.cleanup.hasRun;
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

	useParams(params) {
		this.setParams(params);
	}
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
