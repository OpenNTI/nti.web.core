// @ts-check
import { useReducer, useCallback, useRef, useEffect } from 'react';

/** @typedef {import('./types').dispatch} dispatch */
/** @typedef {import('./types').getSetter} getSetter */
/** @typedef {import('./types').reset} reset */

/**
 * State Merge Reducer
 *
 * @param {object} s
 * @param {object} a
 * @returns {object}
 */
const setStateClone = (s, a) =>
	!a || Object.keys(a).length === 0 ? {} : { ...s, ...a };

/**
 * @template T
 * @param {T} initial
 * @param {any[]} deps
 * @returns {[T, dispatch, reset, getSetter ]}
 */
export function useReducerState(initial, deps = []) {
	const setters = useRef({});
	const [state, dispatch] = useReducer(setStateClone, initial);
	const reset = useCallback(() => {
		setters.current = {};
		dispatch({}); // blank out state first
		dispatch(initial);
	}, [dispatch, initial]);

	useEffect(reset, deps);

	// setter cache
	const cache = setters.current;
	/** @type {getSetter} */
	const getSetterFactory = useCallback(
		(...key) =>
			// use the joined key string as cache key
			cache[key.join()] ||
			// build setter if the above results in nothing...
			(cache[key.join()] = (...x) =>
				dispatch(
					// build object mapping key1: x1, key2: x2, etc...
					key.reduce(
						(result, currentKey, currentIndex) => ({
							...result,
							[currentKey]: x[currentIndex],
						}),
						// starting object
						{}
					)
				)),
		[]
	);

	return [state, dispatch, reset, getSetterFactory];
}
