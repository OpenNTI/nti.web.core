import { useReducer, useEffect } from 'react';

import { getPropertyDescriptor } from '@nti/lib-commons';

import getBoundFunction from '../utils/get-bound-function';

import { useRead } from './use-read';

const AlwaysNew = () => Date.now();
const NotAllowed = () => {
	throw new Error('Operation Not Allowed');
};

const BlankTarget = Object.freeze({});
const ProxyTraps = {
	apply: NotAllowed,
	construct: NotAllowed,
	defineProperty: NotAllowed,
	deleteProperty: NotAllowed,
	get: NotAllowed,
	getOwnPropertyDescriptor: NotAllowed,
	getPrototypeOf: NotAllowed,
	has: NotAllowed,
	isExtensible: NotAllowed,
	ownKeys: NotAllowed,
	preventExtensions: NotAllowed,
	set: NotAllowed,
	setPrototypeOf: NotAllowed,
};

export function useProperties(predicate) {
	let locked = false;

	const [, updateView] = useReducer(AlwaysNew);

	const store = useRead(predicate);
	const monitoredProperties = new Set();

	useEffect(() => {
		locked = true;

		return subscribeToChanges(
			store,
			Array.from(monitoredProperties),
			updateView
		);
	}, [store]);

	return new Proxy(BlankTarget, {
		...ProxyTraps,
		get(_, propertyName) {
			if (locked) {
				throw new Error(
					'Do not store a reference to this intermediate proxy. Get values as properties and discard.'
				);
			}

			monitoredProperties.add(propertyName);
			return getValue(store, propertyName);
		},
	});
}

function getValue(store, property) {
	const read = getPropertyDescriptor(store, property)?.get?.read;
	const value = read
		? read()
		: store.getProperty
		? store.getProperty(property)
		: store[property];

	return typeof value === 'function' ? getBoundFunction(value, store) : value;
}

function subscribeToChanges(store, properties, onChange) {
	if (!store.subscribeToProperties && !store.subscribeToChange) {
		return;
	}

	if (store.subscribeToProperties) {
		return store.subscribeToProperties(properties, onChange);
	}

	const values = () =>
		properties.reduce((acc, prop) => ({ ...acc, [prop]: store[prop] }), {});

	let current = values();

	return store.subscribeToChange(() => {
		const updates = values();
		const changed = properties.some(
			prop => updates[prop] !== current[prop]
		);

		current = updates;

		if (changed) {
			onChange();
		}
	});
}
