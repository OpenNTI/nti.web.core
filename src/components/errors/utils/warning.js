import { getMessage } from './messages';

export function isWarning(error) {
	return Boolean(error?.isWarning);
}

export function makeWarning(error) {
	const message = getMessage(error);
	const warning = new Error(message);

	Object.defineProperty(warning, 'isWarning', { value: true });

	return warning;
}
