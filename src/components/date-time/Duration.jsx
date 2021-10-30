import React from 'react';

import { Typography } from '../text/Text';

import {
	getNaturalDuration,
	getShortNaturalDuration,
	formatISODuration,
} from './utils/format';

/** @typedef {import('./types.d.ts').Duration} Duration */
/**
 * @typedef {Object} DurationProps
 * @property {Duration} duration
 * @property {boolean} short
 */

const ZeroDuration = {
	days: 0,
};

function DurationImpl(
	{ duration, short, precision, singular, ...otherProps },
	ref
) {
	const formatter = short ? getShortNaturalDuration : getNaturalDuration;
	const text = duration ? formatter(duration, precision, singular) : '';

	return (
		<Typography
			ref={ref}
			as="time"
			dateTime={formatISODuration(duration ?? ZeroDuration)}
			{...otherProps}
		>
			{text}
		</Typography>
	);
}

export const Duration = React.forwardRef(DurationImpl);
