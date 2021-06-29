import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';

const LifeCycles = ['initialize', 'reload', 'load', 'cleanup'];

export default class DataStore extends PropertyChangeEmitter {
	static Action = Action;

	static DependentProperties = {
		initializing: ['initialize'],
		initialized: ['initialize'],

		reloading: ['reload'],

		loading: ['loading'],
		loaded: ['loaded'],

		cleaningup: ['cleanup'],
		cleanedup: ['cleanup'],
	};

	#state = {};

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
	}

	//#region Life Cycles
	initialize() {}
	get initializing() {
		return this.initialize.running;
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

	//#region

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
