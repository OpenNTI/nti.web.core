import React from 'react';
import { formatISO, parseJSON } from 'date-fns';

import { Typography } from '../text/Text';
import { Variant } from '../high-order/Variant';

import * as utils from './utils';
import getString from './utils/strings';

const { DEFAULT, format, fromNow, fromWhen, isToday, isYesterday, isTomorrow } =
	utils;

/** @typedef {(date: Date, pattern: string, defaultFormatter: Formatter) => string} Formatter */

/**
 * @typedef {Object} DateTimeProps
 * @property {Date} date The date reference
 * @property {string} format The format to use
 * @property {Formatter} formatter Override how the date gets formatted
 */

/**
 * @param {DateTimeProps} props
 * @param {any} ref
 * @returns {JSX.Element}
 */
function DateTimeImpl(
	{
		date = new Date(),
		format: pattern = DEFAULT,
		formatter = (date, pattern, defaultFormatter) => defaultFormatter(),
		...otherProps
	},
	ref
) {
	if (date == null) {
		return null;
	}

	if ('dangerouslySetInnerHTML' in otherProps) {
		// because we are passing children... they cannot co-exist
		throw new Error(
			'DateTime does not support dangerouslySetInnerHTML prop'
		);
	}

	const defaultFormatter = () => format(date, pattern);
	const text = formatter(date, pattern, defaultFormatter);

	return (
		<Typography
			ref={ref}
			as="time"
			dateTime={formatISO(date instanceof Date ? date : parseJSON(date))}
			{...otherProps}
		>
			{text}
		</Typography>
	);
}

/** @type {DateTimeImpl & utils} */
export const DateTime = Object.assign(React.forwardRef(DateTimeImpl), utils);

/**
 * @typedef {object} RelativeProps
 * @property {Date} to Date to display relative to
 * @property {boolean} suffix add a suffix
 */

/**
 * Display the date relative to a target
 *
 * @type {(props: (DateTimeProps & RelativeProps)) => JSX.Element}
 */
DateTime.Relative = Variant(
	DateTime,
	({ to, suffix = true, ...props }) => ({
		...props,
		formatter: to
			? date => fromWhen(date, to, { addSuffix: suffix })
			: date => fromNow(date, { addSuffix: suffix }),
	}),
	'Relative'
);

/**
 * Display the date relative to the target, but uses "yesterday", "today", and "tomorrow"
 *
 * @type {(props: (DateTimeProps & RelativeProps)) => JSX.Element}
 */
DateTime.RelativeAdverb = Variant(
	DateTime,
	({ to, ...props }) => ({
		...props,
		formatter: (date, pattern, defaultFormatter) => {
			const localeBase = to ? 'relative.other' : 'relative.today';

			if (isToday(date, to)) {
				return getString(`${localeBase}.today`);
			}
			if (isYesterday(date, to)) {
				return getString(`${localeBase}.yesterday`);
			}
			if (isTomorrow(date, to)) {
				return getString(`${localeBase}.tomorrow`);
			}

			return defaultFormatter();
		},
	}),
	'RelativeAdverb'
);

/**
 * Display the date in ISO-8601 format
 *
 * @type {(props: (DateTimeProps)) => JSX.Element}
 */
DateTime.ISO = Variant(
	DateTime,
	({ ...props }) => ({
		...props,
		formatter: date => formatISO(date, { representation: 'complete' }),
	}),
	'ISO'
);
