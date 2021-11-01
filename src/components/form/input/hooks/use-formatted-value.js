import { useRef, useCallback } from 'react';

import { useForceUpdate } from '../../../hooks/use-force-update';

const equality = (a, b) => a === b;

export function useFormattedValue(formatter, initialValue, options = {}) {
	const { valueCompare = equality, formatCompare = equality } = options;
	const update = useForceUpdate();

	const valueRef = useRef(initialValue);
	const formattedRef = useRef(formatter(initialValue));

	return [
		valueRef.current,
		formattedRef.current,
		useCallback(
			(newValue, newFormatted) => {
				const prevValue = valueRef.current;
				const prevFormatted = formattedRef.current;

				valueRef.current = newValue;
				formattedRef.current = newFormatted ?? formatter(newValue);

				if (
					!valueCompare(valueRef.current, prevValue) ||
					!formatCompare(formattedRef.current, prevFormatted)
				) {
					update();
				}
			},
			[update, formatter]
		),
		useCallback(
			newFormatted => {
				const prevFormatted = formattedRef.current;

				formattedRef.current = newFormatted;

				if (!formatCompare(formattedRef.current, prevFormatted)) {
					update();
				}
			},
			[update]
		),
	];
}
