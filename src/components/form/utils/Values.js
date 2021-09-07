import { isValid, getValidationErrors } from './Validation';

const Default = Symbol('Default');

const ValueGetters = {
	[Default]: f => f.value,
	checkbox: f => f.checked,
};

export default function getJSON(form) {
	if (!form) {
		return null;
	}

	const fields = Array.from(form.elements);

	return fields.reduce((acc, field) => {
		if (field.name) {
			acc[field.name] = ValueGetters[field.type]
				? ValueGetters[field.type](field)
				: ValueGetters[Default](field);
		}

		return acc;
	}, {});
}

export function getFormData(form) {
	return new FormData(form);
}

export function getValues(form) {
	return {
		get formData() {
			return getFormData(form);
		},
		get json() {
			return getJSON(form);
		},
		get isValid() {
			return isValid(form);
		},

		getValidationErrors: () => getValidationErrors(form),
	};
}
