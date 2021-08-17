/** @typedef {{}} StoreState */
/** @typedef {{}} StoreParams */
/** @typedef {() => void} Cleanup - a change to remove any listeners*/

// import useForceUpdate from '../hooks/use-force-update';
import { useStore } from '../hooks/use-store';
import { useRead } from '../hooks/use-read';
import { useProperties } from '../hooks/use-properties';

import { createReader } from './Reader';
import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';
import * as Behaviors from './behaviors/Behaviors';

const LifeCycles = ['load', 'unload'];

const BuildPredicate = Store => check => check instanceof Store;
export class StateStore extends PropertyChangeEmitter {
	static Action = Action;
	static Behaviors = Behaviors;

	static create(...args) {
		const Store = this;

		return new Store(...args);
	}

	/**
	 * Create and track an instance of this store
	 *
	 * @template T
	 * @param {...*} args
	 * @returns {T}
	 */
	static useStore(...args) {
		return useStore(this, ...args);
	}

	/**
	 * Find the closest instance of this store and use its read value.
	 *
	 * @returns {*}
	 */
	static useRead() {
		return useRead(BuildPredicate(this));
	}

	/**
	 * Find the closes instance of this store and use its properties.
	 *
	 * @returns {*}
	 */
	static useProperties() {
		return useProperties(BuildPredicate(this));
	}

	constructor() {
		super();

		this.#reader = createReader(this);

		this.onceSetup = new Promise(fulfill =>
			setTimeout(
				() => (
					this.#setupActions(),
					this.#initializeParams(),
					this.#initializeState(),
					fulfill()
				)
			)
		);

		//Set these up in the constructor, so they cannot be overridden
		this.addDependentProperty('reader', ['load']);

		this.addDependentProperty('loading', 'load');
		this.addDependentProperty('loaded', 'load');

		this.addDependentProperty('unloading', 'unload');
		this.addDependentProperty('unloaded', 'unload');
	}

	#setupActions() {
		const store = this;
		const binding = key => ({
			scope: store,

			getData: () => ({
				get state() {
					return store.#state;
				},
				get params() {
					return store.#params;
				},
			}),
			onUpdate: (...args) => this.updateState(...args),
			onStart: () => this.onChange(key),
			onError: () => this.onChange(key),
			onFinish: () => this.onChange(key),
		});

		for (let [key, value] of Object.entries(this)) {
			if (LifeCycles.includes(key) && value.bindStore) {
				throw new Error('DataStore life-cycles cannot be actions');
			}

			if (value?.bindStore) {
				delete this[key];
				Object.defineProperty(this, key, {
					value: value.bindStore(binding(key)),
				});
			}
		}

		for (let cycle of LifeCycles) {
			this[cycle] = Action.Superseded(this[cycle]).bindStore(
				binding(cycle)
			);
		}
	}

	/**
	 * Get a property off the store.
	 *
	 * Looks for property on:
	 *
	 * 1. the current state
	 * 2. the store itself
	 * 3. the parameters
	 *
	 * @param {string} property
	 * @returns {*}
	 */
	getProperty(property) {
		const options = [
			this.#state[property],
			this[property],
			this.#params[property],
		];

		return options.find(p => p !== undefined);
	}

	#reader = null;
	/**
	 * returns the read for this store instance.
	 *
	 * @throws {Promise} - when the store is loading
	 * @throws {Error} - when the load errored
	 * @returns {StateStore}
	 */
	read() {
		return this.#reader.read();
	}

	//#region Life Cycles

	/**
	 * Calls load if it has not been called yet. Used by the `useStore` hook.
	 *
	 * @package
	 */

	/**
	 * Called when the store does it's initial load.
	 *
	 * Serves as a place to attach listeners to outside objects and update params or state as needed. Similar to `useEffect`.
	 *
	 * NOTE: returned `cleanup` must remove those listeners
	 *
	 * @abstract
	 * @returns {Cleanup}
	 */
	onInitialized() {}
	#initializedCleanup = null;
	#onInitialized() {
		this.#initializedCleanup = this.onInitialized();
	}

	initialLoad() {
		if (!this.load.hasRun && !this.load.running) {
			this.#onInitialized();
			this.#load();
		}
	}

	reload() {
		if (this.load.hasRun) {
			this.#load();
		}
	}

	#loadTimeout = null;
	#load() {
		if (!this.#loadTimeout) {
			this.#loadTimeout = setTimeout(async () => {
				this.#loadTimeout = null;

				await this.onceSetup;
				await this.load();
			}, 1);
		}
	}

	/**
	 * Load the state of the store.
	 *
	 * The params and current state of the store are available on first arg.
	 *
	 * Calls to load will be aborted by any subsequent calls, so be sure to check signal on the first arg to see if you should stop loading.
	 *
	 * NOTE: if you have to call this directly, you probably aren't using it right.
	 *
	 * @abstract
	 * @private
	 * @param {import('./Action').ActionObject} action
	 */
	load(action) {}
	get loading() {
		return this.load.running;
	}
	get loaded() {
		return this.load.hasRun;
	}

	/**
	 * Called by the `useState` hook when the store unmounts
	 *
	 * @package
	 */
	unload() {
		this.#stateChangeCleanup?.();
		this.#paramsChangeCleanup?.();
	}
	get unloading() {
		return this.unload.running;
	}
	get unloaded() {
		return this.unload.hasRun;
	}
	//#endregion

	//#region State
	#state = {};

	getInitialState() {
		return {};
	}
	#initializeState() {
		this.#state = this.getInitialState();
	}

	/**
	 * Merge new store state into the old store state.
	 *
	 * @param {StoreState} newState
	 * @param {StoreState} prevState
	 * @returns {StoreState}
	 */
	mergeState(newState, prevState) {
		return { ...prevState, ...newState };
	}

	/**
	 * Push new state into the store
	 *
	 * @param {StoreState} newState
	 */
	updateState(newState = {}) {
		const oldState = this.#state;
		const updated = Object.keys(newState);
		const merged = this.mergeState(newState, this.#state);

		this.#state = merged;

		this.#stateDidUpdate(this.#state, oldState);
		this.onChange(updated);
	}

	/**
	 * Called when the store's state updated.
	 *
	 * Serves as a place to attach listeners to items in the state as needed.
	 * Similar to `useEffect`.
	 *
	 * NOTE: returned `cleanup` must remove those listeners
	 *
	 * @abstract
	 * @param {StoreState} currentState - the updated store state
	 * @param {StoreState} prevState - the previous store state
	 * @returns {Cleanup}
	 */
	onStateUpdate(currentState, prevState) {}
	#stateChangeCleanup = null;
	#stateDidUpdate(...args) {
		this.#stateChangeCleanup?.();
		this.#stateChangeCleanup = this.onStateUpdate(...args);
	}
	//#endregion

	//#region Param
	#params = {};

	getInitialParams() {
		return {};
	}
	#initializeParams() {
		this.#params = this.getInitialParams();
	}

	/**
	 * Check if the new params have newer data than the old params
	 *
	 * @param {StoreParams} newParams
	 * @param {StoreParams} prevParams
	 * @returns {boolean}
	 */
	didParamsChange(newParams, prevParams) {
		return Object.entries(newParams).some(
			param => prevParams[param[0]] !== param[1]
		);
	}

	/**
	 * Merge new params into the old params
	 *
	 * @param {StoreParams} newParams
	 * @param {StoreParams} prevParams
	 * @returns {StoreParams}
	 */
	mergeParams(newParams = {}, prevParams = {}) {
		return { ...prevParams, ...newParams };
	}

	/**
	 * Update the store's params. If load has been called already, this will trigger a new load.
	 *
	 * @param {StoreParams} params
	 * @returns {void}
	 */
	setParams(params = {}) {
		if (this.unloading || this.unloaded) {
			return;
		}

		const oldParams = this.#params;
		const changed = this.didParamsChange(params, this.#params);

		this.#params = this.mergeParams(params, this.#params);

		if (changed) {
			this.#paramsDidUpdate(this.#params, oldParams);
			this.reload();
			this.onChange(Object.keys(params));
		}
	}

	/**
	 * Called when the store's params update.
	 *
	 * Serves as a place to attach listeners to objects in the store's params.
	 * Similar to `useEffect`.
	 *
	 * NOTE: returned `cleanup` must remove those listeners
	 *
	 * @abstract
	 * @param {StoreParams} currentParams
	 * @param {StoreParams} oldParams
	 * @returns {Cleanup}
	 */
	onParamsUpdate(currentParams, oldParams) {}
	#paramsChangeCleanup = null;
	#paramsDidUpdate(...args) {
		this.#paramsChangeCleanup?.();

		this.#paramsChangeCleanup = this.onParamsUpdate(...args);
	}

	//#endregion
}
