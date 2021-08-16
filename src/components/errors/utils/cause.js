export function setCause(error, cause) {
	Object.defineProperties(error, {
		cause: { value: cause },
		isWarning: { get: () => cause.isWarning },
		field: { get: () => cause.field },
	});

	return error;
}
