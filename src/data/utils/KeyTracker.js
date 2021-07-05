import React from 'react';

const TrackedMap = new Map();

function untrack(Track, key) {
	const tracked = TrackedMap.get(Track);

	if (!tracked?.has(key)) {
		//is this even possible? I guess if we call untrack and its not tracked, just do nothing...
		return;
	}

	const trackedKey = tracked.get(key);

	if (trackedKey.count === 1) {
		TrackedMap.delete(Track);
	} else {
		TrackedMap.set(Track, {
			...trackedKey,
			count: trackedKey.count - 1,
		});
	}
}

export function isTracked(Track, key) {
	return TrackedMap.get(Track)?.get(key)?.count > 0;
}

export function getTracked(Track, key) {
	if (!key) {
		return {
			Track,
			key,
			tracked: new Track(),
			free: () => {},
		};
	}

	if (!TrackedMap.has(Track)) {
		TrackedMap.set(Track, new Map());
	}

	const tracked = TrackedMap.get(Track);

	if (!tracked.has(key)) {
		tracked.set(key, {
			tracked: new Track(),
			count: 1,
		});
	}

	return {
		Track,
		key,
		tracked: tracked.get(key).tracked,
		free: () => untrack(Track, key),
	};
}

export function useTracked(Track, key) {
	const trackedRef = React.useRef();

	if (
		!trackedRef.current ||
		trackedRef.current.Track !== Track ||
		trackedRef.current.key !== key
	) {
		trackedRef.current?.free();
		trackedRef.current = getTracked(Track, key);
	}

	React.useEffect(() => {
		return () => trackedRef.current?.free();
	}, []);

	return trackedRef.current.tracked;
}
