import Action from './Action';
import PropertyChangeEmitter from './PropertyChangeEmitter';

export default class DataStore extends PropertyChangeEmitter {
	static Action = Action;

	#state = {};

	constructor() {
		super();

		for (let [key, value] of Object.entries(this)) {
			if (value.bindStore) {
				Object.defineProperty(
					this,
					key,
					value.bindStore({
						scope: this,
						onUpdate: (...args) => this.updateState(...args),
						onStart: () => this.onChange(key),
						onError: () => this.onChange(key),
						onFinish: () => this.onChange(key),
					})
				);
			}
		}
	}

	//#region State Updating
	updateState(newState) {
		const updated = Object.keys(newState);
		const merged = this.applyState(newState);

		this.#state = merged;

		this.emitChange(updated);
	}

	applyState(newState) {
		return { ...this.#state, ...newState };
	}
	//#endregion
}
