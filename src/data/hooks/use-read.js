/** @typedef {(store: import('./use-store').StoreInstance) => boolean} Predicate */
/** @typedef {Predicate|import('./use-store').StoreInstance} PredicateOrStore */

import { DataContext } from '../Context';

const Identity = x => x;

/**
 * Return the read of the store instance or the instance from context that matches the predicate.
 *
 * @param {PredicateOrStore} predicate - store instance or predicate to match a store instance from the context
 * @returns {*}
 */
export function useRead(predicate) {
	const { stores } = DataContext.useContext();
	const filtered = predicate?.read
		? [predicate]
		: stores.filter(predicate ?? Identity);

	const store = filtered[filtered.length - 1];

	// if there is no read(), just return the store
	return store?.read ? store.read() : store;
}
