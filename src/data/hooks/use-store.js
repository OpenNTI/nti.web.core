import { useEffect } from 'react';

import KeyTracker from '../utils/KeyTracker';

const byKey = (a, b) => (a[0] < b[0] ? 1 : a[0] === b[0] ? 0 : -1);
const getParamDepList = p => Object.entries().sort(byKey).flat();

export default function useStore(Store, options = {}) {
	const { key, ...params } = options;
	const store = KeyTracker.useTracked(Store, key);

	useEffect(() => store.setParams?.(params), getParamDepList(params));

	useEffect(() => {
		store.initialLoad?.();

		return () => {
			if (!KeyTracker.isTracked(Store, key)) {
				store.unload?.();
			}
		};
	}, [store]);

	return store;
}
