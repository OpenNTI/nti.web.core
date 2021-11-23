import { useCallback, useEffect } from 'react';

import { Box } from '../../../box/Box';
import { Duration as DurationLabel } from '../../../date-time/Duration';
import { getDurationUnit } from '../../../date-time/utils';
import { Flyout } from '../../../flyout/Flyout';
import { Chevron } from '../../../icons';
import { Combined } from '../groups/Combined';
import { useFormattedValue } from '../hooks/use-formatted-value';
import { TriggerInner } from '../lists/common';
import { Select } from '../lists/Select';
import {
	getPlaceholderStyleProps,
	getInputStyleProps,
} from '../get-input-props';
import { Number } from '../Number';

import {
	getDurationFromInputs,
	getInputsFromDuration,
} from './utils/duration-inputs';

/** @typedef {import('../../../date-time/types').Duration} Duration */
/** @typedef {import('../../../date-time/types').DurationUnit} DurationUnit */
/** @typedef {number} Precision - How many units to allow */

/**
 * @typedef {object} DurationInputProps
 * @property {Duration} value
 * @property {(Duration) => void} onChange
 * @property {string} placeholder
 * @property {Precision} precision
 * @property {DurationUnit} maxUnit
 * @property {DurationUnit} minUnit
 */

const isSameDuration = (a, b) => {
	return (
		a === b ||
		(a &&
			b &&
			a.years === b.years &&
			a.months === b.months &&
			a.weeks === b.weeks &&
			a.days === b.days &&
			a.hours === b.hours &&
			a.minutes === b.minutes &&
			a.seconds === b.seconds)
	);
};

const isSameInputs = (a, b) => {
	return (
		a === b ||
		(a.length === b.length &&
			a.every((aInput, index) => {
				const bInput = b[index];

				return (
					aInput.value === bInput.value && aInput.unit === bInput.unit
				);
			}))
	);
};

/**
 * An input for durations
 *
 * @param {DurationInputProps} props
 * @returns {JSX.Element}
 */
export function Duration({
	value: valueProp,
	onChange,
	placeholder = 'Enter a duration',
	precision,
	maxUnit,
	minUnit,
	...otherProps
}) {
	const [value, inputs, setValue] = useFormattedValue(
		useCallback(
			value => getInputsFromDuration(value, precision, maxUnit, minUnit),
			[precision, maxUnit, minUnit]
		),
		valueProp,
		{
			valueCompare: isSameDuration,
			formatCompare: isSameInputs,
		}
	);

	useEffect(() => {
		if (isSameDuration(valueProp, value)) {
			setValue(valueProp);
		}
	}, [valueProp]);

	const onInputChange = useCallback(
		(index, value, unit) => {
			const newInputs = [...inputs].map(i => ({ ...i }));

			newInputs[index].value = value;
			newInputs[index].unit = unit;

			const newValue = getDurationFromInputs(newInputs);

			setValue(newValue, newInputs);

			if (newValue !== valueProp) {
				onChange?.(newValue);
			}
		},
		[inputs, valueProp, onChange]
	);

	return (
		<Flyout horizontalAlign="left-or-right">
			<Flyout.Trigger
				as="span"
				variant="plain"
				role="button"
				aria-haspopup="listbox"
				{...getInputStyleProps(otherProps)}
			>
				<TriggerInner>
					{value ? (
						<DurationLabel duration={value} />
					) : (
						<span {...getPlaceholderStyleProps({})}>
							{placeholder}
						</span>
					)}
					<Chevron.Down large />
				</TriggerInner>
			</Flyout.Trigger>
			<Flyout.Content>
				<div>
					<Box p="sm">
						{inputs.map((input, index) => (
							<DurationUnit
								index={index}
								value={input.value}
								unit={input.unit}
								units={input.units}
								onChange={onInputChange}
								key={index}
							/>
						))}
					</Box>
				</div>
			</Flyout.Content>
		</Flyout>
	);
}

function DurationUnit({ index, value, unit, units, onChange }) {
	const onValueChange = useCallback(
		newValue => onChange?.(index, newValue, unit),
		[index, unit, onChange]
	);

	const onUnitChange = useCallback(
		newUnit => onChange?.(index, value, newUnit),
		[index, value, onChange]
	);

	return (
		<Combined>
			<Number value={value} onChange={onValueChange} />
			<Select value={unit} onChange={onUnitChange}>
				{units.map(u => (
					<option value={u} key={u}>
						{getDurationUnit(u, true)}
					</option>
				))}
			</Select>
		</Combined>
	);
}
