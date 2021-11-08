import { useCallback, useEffect } from 'react';
import zpad from 'zpad';

import { Text } from './Text';
import { getNumber } from './utils/get-number';
import { setInput } from './utils/identity';
import { useFormattedValue } from './hooks/use-formatted-value';

/** @typedef {number | ''} NumberValue */

/**
 * @typedef {Object} NumberInputProps
 * @property {NumberValue} value
 * @property {(number) => void} onChange
 * @property {number} max - max number to allow
 * @property {number} min - min number to allow
 */

const MaxValue = Number.MAX_SAFE_INTEGER;
const KeyDownDeltas = {
	38: 1, //up arrow
	40: -1, //down arrow
};

export function Number({
	value: valueProp,
	onChange: onChangeProp,
	format = x => x,

	max,
	min,
	step = 1,
	constrain,
	pad,

	onKeyPress: onKeyPressProp,
	onKeyDown: onKeyDownProp,
	onIncrement,
	onDecrement,

	...otherProps
}) {
	const [value, formatted, setValue] = useFormattedValue(
		useCallback(
			v => {
				const num = getNumber(v);

				return format(
					pad
						? zpad(v, typeof pad === 'number' ? pad : 2)
						: num?.toFixed()
				);
			},
			[format, pad]
		),
		valueProp
	);

	useEffect(() => {
		if (valueProp !== value) {
			setValue(valueProp);
		}
	}, [valueProp]);

	const onChange = useCallback(
		(newValue, e) => {
			let number = getNumber(newValue);

			if (number != null) {
				//null value is acceptable, even constrained. Constraints should only be placed on numeric values.
				if (constrain && !isNaN(max)) {
					number = Math.min(number, getNumber(max));
				}

				if (constrain && !isNaN(min)) {
					number = Math.max(number, getNumber(min));
				}
			}

			if (number >= MaxValue) {
				return;
			}

			setValue(number, newValue);

			if (number !== value) {
				onChangeProp?.(number, e);
			}
		},
		[onChangeProp, min, max, constrain]
	);

	//Because of FIREFOX we still have to listen to KeyPress.
	const onKeyPress = useCallback(
		e => {
			const minNumber = getNumber(min);
			const allowed = {
				44: ',',
				45: minNumber && minNumber < 0 ? '-' : false, //don't allow 'negative sign' is the min is specified and positive.
				46: '.',
			};

			//If we aren't a number and we aren't one of the allowed characters
			if ((e.charCode < 48 || e.charCode > 57) && !allowed[e.charCode]) {
				e.preventDefault();
			}

			onKeyPressProp?.(e);
		},
		[onKeyPressProp, min]
	);

	const onKeyDown = useCallback(
		e => {
			onKeyDownProp?.(e);

			const delta = KeyDownDeltas[e.keyCode];

			if (!delta) {
				return;
			}

			e.preventDefault();
			let newValue = getNumber(value || 0) + delta * step;

			if (!isNaN(min)) {
				newValue = Math.max(newValue, getNumber(min));
			}

			if (!isNaN(max)) {
				newValue = Math.min(newValue, getNumber(max));
			}

			onChange(newValue, e);
		},
		[onKeyDownProp, value, step, min, max]
	);

	return (
		<Text
			value={formatted}
			pattern="[0-9]*"
			onChange={onChange}
			onKeyPress={onKeyPress}
			onKeyDown={onKeyDown}
			{...otherProps}
		/>
	);
}

setInput(Number);
