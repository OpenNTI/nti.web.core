/** @typedef {import('@nti/lib-commons/src/promises/to-reader').Reader} StoreReader - Suspense wrapper around the store load */
/** @typedef {string} Key - mark a store for re-use if the keys match (no key means always unique) */
/** @typedef {{}} Parameters - passed into the store */
/** @typedef {(Parameters) => void} ParameterUpdate */
/** @typedef {() => void} InitialLoad - called after the first render with a StoreInstance */
/** @typedef {() => void} Unload - called when a StoreInstance is no longer used*/
/** @typedef {{read:StoreReader, setParams:ParameterUpdate, initialLoad:InitialLoad, unload:Unload}} StoreInstance */
/** @typedef {{create: () => StoreInstance}} StoreFactory */

import { useEffect } from 'react';

import { useTracked, isTracked } from '../utils/KeyTracker';

const byKey = (a, b) => (a[0] < b[0] ? 1 : a[0] === b[0] ? 0 : -1);
const noInitials = ([key]) => !key?.startsWith?.('initial');
const getParamDepList = p =>
	Object.entries(p).filter(noInitials).sort(byKey).flat();

/**
 * useStore does two things:
 * 1. Create and track a StoreInstance
 * 2. Update the StoreInstance when the parameters change
 *
 * @param {StoreFactory} Store
 * @param {...Parameters} options
 * @param {Key} options.key
 * @returns {StoreInstance}
 */
export function useStore(Store, options = {}) {
	const { key, ...params } = options;
	const store = useTracked(Store, key);
	useEffect(() => store.setParams?.(params), getParamDepList(params));

	useEffect(() => {
		store.initialLoad?.();

		return () => {
			//Check if the particular Store/key combo is being tracked anywhere else before unloading it
			if (!isTracked(Store, key)) {
				store.unload?.();
			}
		};
	}, [store]);

	return store;
}
