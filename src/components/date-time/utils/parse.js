import { parse as parseDate } from 'date-fns';
import { parse as parseDuration } from 'tinyduration';

/** @typedef {import('../types.d.ts').Duration} Duration */

export function parse(str, format, options) {
	const date = parseDate(str, format, new Date(), options);

	if (date instanceof Date && !isNaN(date.valueOf())) {
		return date;
	}

	return undefined;
}

/**
 * Convert an ISO-8601 duration into a duration object
 *
 * @param {string} str
 * @returns {Duration}
 */
export function parseISODuration(str) {
	return parseDuration(str);
}
