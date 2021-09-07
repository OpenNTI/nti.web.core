import { scoped } from '@nti/lib-locale';

const t = scoped('nti-web-commons.form.validation.get-validation-error', {
	missing: 'Please fill out this field.',
	invalidEmail: 'Please provide a valid email.',
	patternMismatch: 'Please match the requested format',
});

const checks = [
	{
		message: field => field.dataset.missingMessage ?? t('missing'),
		check: field => field.required && field.validity.valueMissing,
	},
	{
		message: field =>
			field.dataset.invalidEmailMessage ?? t('invalidEmail'),
		check: field => field.type === 'email' && field.validity.typeMismatch,
	},
	{
		message: field =>
			field.dataset.patternMismatchMessage ?? t('patternMismatch'),
		check: field => field.validity.patternMismatch,
	},
	{
		message: field => field.validationMessage,
		check: () => true,
	},
];

export function getValidationError(field) {
	const error = checks.find(c => c.check(field))?.message(field);

	if (!error) {
		return null;
	}

	error.field = field.name;

	return error;
}

export function getValidationErrors(form) {
	const invalid = Array.from(form.querySelectorAll(':invalid'));

	if (!invalid || !invalid.length) {
		return null;
	}

	return invalid.map(getValidationError);
}

export function isValid(form) {
	if (!form) {
		return true;
	}

	const invalid = Array.from(form.querySelectorAll(':invalid'));

	return !invalid || !invalid.length;
}
