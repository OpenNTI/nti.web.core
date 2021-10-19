import { reportError } from '@nti/web-client';
import Logger from '@nti/util-logger';

const logger = Logger.get('common:components:Error');

export function report(error) {
	if (!error) {
		return;
	}
	if (reportError(error) === false) {
		logger.error(
			error.stack || error.message || error.responseText || error
		);
	} else {
		logger.error('Error reported.');
	}
}
