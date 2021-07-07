// import useForceUpdate from '../hooks/use-force-update';
// import {useStore} from '../hooks/use-store';
// import {useRead} from '../hooks/use-read';
// import {useProperties} from '../hooks/use-properties';

import { createReader } from './Reader';
import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';

const LifeCycles = ['initialLoad', 'load', 'unload'];

export default class DataStore extends PropertyChangeEmitter {
	static Action = Action;

	constructor() {
		super();

		this.#reader = createReader(this);

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
		return this.#reader.read();
	}

	//#region Life Cycles

	initialLoad() {
		if (!this.load.hasRun) {
			return this.#load(true);
		}
	}

	#reload() {
		if (this.load.hasRun) {
			this.#load();
		}
	}

	#loadAbortController = null;
	#pendingLoad = null;
	#load(forceRun) {
		this.#loadAbortController?.abort();
		this.#loadAbortController = null;

		if (!this.#pendingLoad) {
			this.#pendingLoad = new Promise((fulfill, reject) => {
				setTimeout(async () => {
					const abort = new AbortController();

					this.#loadAbortController = forceRun ? null : abort;
					this.#pendingLoad = null;

					await this.load(this.#params, abort);

					if (this.load.error) {
						reject(this.load.error);
					} else {
						fulfill();
					}
				}, 1);
			});
		}

		return this.#pendingLoad;
	}

	load() {}
	get loading() {
		return this.load.running;
	}
	get loaded() {
		return this.load.hasRun;
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

	updateState(newState = {}) {
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
