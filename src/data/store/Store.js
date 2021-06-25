import Action from './Action';

export default class DataStore {
	static Action = Action;

	#state = {};

	constructor() {
		for (let [key, value] of Object.entries(this)) {
			if (value.bindStore) {
				Object.defineProperty(
					this,
					key,
					value.bindStore({
						scope: this,
						onUpdate: (...args) => this.#updateState(...args),
						onStart: () => this.#emitChange(key),
						onError: () => this.#emitChange(key),
						onFinish: () => this.#emitChange(key),
					})
				);
			}
		}
	}

	//#region Changes
	#listeners = new Map();

	#emitChange(keys) {
		const listeners = new Set();

		for (let key of keys) {
			const keyListeners = this.#listeners.get(key);

			keyListeners.forEach(k => listeners.add(k));
		}

		listeners.forEach(l => l());
	}

	subscribe(key, fn) {
		if (Array.isArray(key)) {
			const cleanup = key.map(k => this.subscribe(key));

			return () => cleanup.forEach(c => c());
		}

		if (!this.#listeners.has(key)) {
			this.#listeners.set(key, new Set());
		}

		this.#listeners.get(key).add(fn);

		return () => {
			const existing = this.#listeners.get(key);

			existing.delete(fn);

			if (existing.size === 0) {
				this.#listeners.remove(key);
			}
		};
	}
	//#endregion

	//#region State Updating
	#updateState(newState) {
		const updated = Object.keys(newState);
		const merged = this.applyState(newState);

		this.#state = merged;

		this.#emitChange(updated);
	}

	applyState(newState) {
		return { ...this.#state, ...newState };
	}
	//#endregion
}
