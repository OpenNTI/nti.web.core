import { scoped } from '@nti/lib-locale';

import { setCause } from './cause';

const t = scoped('core.errors.messages', {
	default: 'An error occurred.',
});

export function getMessage(error) {
	if (typeof error === 'string' || !error) {
		return error;
	}

	return error.Message ?? error.message ?? t('default');
}

export function mapMessage(error, msg) {
	const mapped = new Error(msg);

	setCause(mapped, error);

	return mapped;
}
