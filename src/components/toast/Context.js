import EventEmitter from 'events';

import { createContext, useContext, useEffect, useState } from 'react';

import LayerManager from '../../system/layers/Manager';

import { Container } from './container/Container';

class ToastContext extends EventEmitter {
	#namespace = '';
	#id = 0;
	#toasts = [];
	#updateToastsTimeout = null;

	constructor(namespace) {
		super();

		this.#namespace = namespace;
	}

	getNextId() {
		this.#id += 1;

		return `${this.#namespace}-${this.#id}`;
	}

	subscribeToToasts(fn) {
		this.addListener('toasts-update', fn);

		return () => this.removeListener('toasts-update', fn);
	}

	updateToasts() {
		clearTimeout(this.#updateToastsTimeout);

		this.#updateToastsTimeout = setTimeout(() => {
			this.emit('toasts-update', this.#toasts);
		});
	}

	addToast(id, data) {
		this.#toasts = [...this.#toasts, { id, ...data }];
		this.updateToasts();
	}

	updateToast(id, data) {
		this.#toasts = this.#toasts.map(t =>
			t.id === id ? { ...t, ...data } : t
		);
		this.updateToasts();
	}

	removeToast(id) {
		this.#toasts = this.#toasts.filter(t => t.id !== id);
		this.updateToasts();
	}
}

const GlobalContext = new ToastContext('global-toast');
let GlobalContextLayer = null;

GlobalContext.subscribeToToasts(toasts => {
	if (toasts.length === 0) {
		if (GlobalContextLayer) {
			LayerManager.removeLayer(GlobalContextLayer);
			GlobalContextLayer = null;
		}
	} else {
		if (!GlobalContextLayer) {
			GlobalContextLayer = LayerManager.createLayer({ level: 'top' });
		}

		GlobalContextLayer.render(<Container toasts={toasts} global />);
	}
});

const Context = createContext(GlobalContext);

export const useToastContext = () => useContext(Context);

export function ToastContainer({
	as: Cmp = 'div',
	location,
	namespace,
	children,
	...otherProps
}) {
	const [toasts, setToasts] = useState([]);
	const [context] = useState(() => new ToastContext(namespace));

	useEffect(() => context.current.subscribeToToasts(setToasts), [setToasts]);

	return (
		<Context.Provider value={context.current}>
			<Cmp {...otherProps}>
				{children}
				<Container toasts={toasts} location={location} />
			</Cmp>
		</Context.Provider>
	);
}
