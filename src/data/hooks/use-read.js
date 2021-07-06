import React from 'react';

import Context from '../Context';

const Identity = x => x;

export default function useRead(predicate) {
	const { stores } = Context.useContext();

	const filtered = React.useMemo(() => {
		if (predicate.read) {
			return [predicate];
		}

		return stores.filter(predicate ?? Identity);
	}, [predicate, stores]);

	const store = filtered[filtered.length - 1];

	return store?.read();
}
