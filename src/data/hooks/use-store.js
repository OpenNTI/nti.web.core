import React from 'react';

import KeyTracker from '../utils/KeyTracker';

export default function useStore(Store, key) {
	const store = KeyTracker.useTracked(Store, key);

	React.useEffect(() => {
		store.initialLoad?.();

		return () => {
			if (!KeyTracker.isTracked(Store, key)) {
				store.cleanup?.();
			}
		};
	}, [store]);

	return store;
}
