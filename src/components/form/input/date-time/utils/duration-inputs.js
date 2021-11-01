const Years = 'years';
const Months = 'months';
const Weeks = 'weeks';
const Days = 'days';
const Hours = 'hours';
/** @typedef (import('../../../../date-time/types.d.ts').Duration) Duration */

const Minutes = 'minutes';
const Seconds = 'seconds';

const Units = [Years, Months, Weeks, Days, Hours, Minutes, Seconds];

export function getInputsFromDuration(
	value,
	precision = 1,
	maxUnit = Years,
	minUnit = Seconds
) {
	if (precision > 1) {
		throw new Error(
			"Duration Input doesn't not support > 1 level of precision "
		);
	}

	const maxIndex = Units.indexOf(maxUnit);
	const minIndex = Units.indexOf(minUnit) + 1;

	const possibleUnits = Units.slice(maxIndex, minIndex);

	const valueUnit = value
		? possibleUnits.find(unit => value[unit] != null)
		: possibleUnits[4];

	return [
		{
			value: value?.[valueUnit] ?? 1,
			unit: valueUnit,
			units: possibleUnits,
		},
	];
}

export function getDurationFromInputs(inputs) {
	const duration = {};
	let hasValues = false;

	for (let input of inputs) {
		if (input.value) {
			hasValues = true;
			duration[input.unit] = input.value;
		}
	}

	return hasValues ? duration : null;
}
