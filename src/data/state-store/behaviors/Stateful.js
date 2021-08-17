function MemoryStorage() {
	const state = {};

	return {
		getItem: key => state[key],
		setItem: (key, value) => (state[key] = value),
	};
}

export const Stateful = storage => {
	storage = storage || MemoryStorage;

	if (!storage.setItem || !storage.getItem) {
		throw new Error('Invalid Storage Passed');
	}

	return Base =>
		class extends Base {
			static StateKey = '';

			// static get StatefulProperties() {
			// 	return Base.StatefulProperties ?? [];
			// }
			// static get StatefulParams() {
			// 	return Base.StatefulParams ?? [];
			// }

			getStateKey(scope) {
				const key = this.constructor.StateKey;
				const stateKey = typeof key === 'function' ? key(this) : key;

				return `${stateKey}-${scope}`;
			}

			updateStorage(subKey, properties = []) {
				if (properties.length === 0) {
					return;
				}

				const state = properties.reduce(
					(acc, property) => ({
						...acc,
						[property]: this.getProperty(property),
					}),
					{}
				);

				storage.setItem(
					this.getStateKey(subKey),
					JSON.stringify(state)
				);
			}

			getInitialParams() {
				const state = JSON.parse(
					storage.getItem(this.getStateKey('params')) ?? '{}'
				);
				const base = super.getInitialParams();

				return (this.constructor.StatefulParams ?? []).reduce(
					(acc, param) => {
						if (state[param] == null) {
							return acc;
						}

						return { ...acc, [param]: state[param] };
					},
					{ ...base }
				);
			}

			getInitialState() {
				const state =
					storage.getItem(this.getStateKey('properties')) ?? {};
				const base = super.getInitialState();

				return (this.constructor.StatefulProperties ?? []).reduce(
					(acc, prop) => {
						if (state[prop] == null) {
							return acc;
						}

						return { ...acc, [prop]: state[prop] };
					},
					{ ...base }
				);
			}

			onParamsUpdate(...args) {
				const base = super.onParamsUpdate(...args);

				this.updateStorage('params', this.constructor.StatefulParams);

				return base;
			}

			onStateUpdate(...args) {
				const base = super.onStateUpdate(...args);

				this.updateStorage(
					'properties',
					this.constructor.StatefulProperties
				);

				return base;
			}
		};
};

Stateful.InMemoryStorage = MemoryStorage;
