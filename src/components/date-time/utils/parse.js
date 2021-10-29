import { parse as parseDate } from 'date-fns';

export function parse(str, format, options) {
	const date = parseDate(str, format, new Date(), options);

	if (date instanceof Date && !isNaN(date.valueOf())) {
		return date;
	}

	return undefined;
}
