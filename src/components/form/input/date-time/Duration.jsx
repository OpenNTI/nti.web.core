import { Flyout } from '../../../flyout/Flyout';
import { Duration as DurationLabel } from '../../../date-time/Duration';
import {
	getInputStyleProps,
	getPlaceholderStyleProps,
} from '../get-input-props';
import { TriggerInner } from '../lists/common';
import { Chevron } from '../../../icons';

import { getDurationInputs } from './utils/get-duration-inputs';

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

export function Duration({
	value,
	onChange,
	placeholder = 'Enter a duration',
	precision,
	maxUnit,
	minUnit,
	...otherProps
}) {
	const inputs = getDurationInputs(value, precision, maxUnit, minUnit);

	debugger;
	console.log(inputs);

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
				<div>Duration Input</div>
			</Flyout.Content>
		</Flyout>
	);
}
