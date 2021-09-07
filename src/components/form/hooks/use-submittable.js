import { useReducer, useCallback, useMemo, useRef } from 'react';

import { getValidationErrors, isValid } from '../utils/Validation';
import { getValues } from '../utils/Values';

const AddErrors = 'add-errors';
const ClearError = 'clear-error';
const SetSubmitting = 'set-submitting';

const getInitialState = () => ({ errors: [], submitting: false });
function SubmittableReducer(state, action) {
	if (action.type === AddErrors) {
		const { errors } = action;

		return {
			...state,
			errors: [
				...state.errors,
				...(Array.isArray(errors) ? errors : [errors]),
			],
		};
	} else if (action.type === ClearError) {
		const { name } = action;
		const { errors } = state;

		return {
			...state,
			errors: errors.filter(e => e.field === name || e.field == null),
		};
	} else if (action.type === SetSubmitting) {
		const { submitting } = action;

		return { ...state, submitting };
	}

	return state;
}

function useChangeHandler({
	form,
	disabled,
	addErrors,
	onChange,
	onInvalid,
	onValid,
}) {
	return useMemo(
		e => {
			if (!onChange && !onValid && !onInvalid) {
				return null;
			}

			let wasValid = isValid(form.current);

			const callOnChange = async e => {
				if (!onChange) {
					return;
				}

				try {
					await onChange(getValues(form.current), e);
				} catch (err) {
					addErrors(err);
				}
			};

			return e => {
				const valid = isValid(form.current);

				callOnChange(e);

				if (valid === wasValid) {
					return;
				}

				wasValid = valid;

				if (valid) {
					onValid?.(e);
				}
				if (!valid) {
					onInvalid?.(e);
				}
			};
		},
		[form, disabled, addErrors, onChange, onValid, onInvalid]
	);
}

function useSubmitHandler({
	form,
	disabled,
	addErrors,
	onSubmit,
	afterSubmit,
	setSubmitting,
}) {
	return useMemo(() => {
		if (!onSubmit) {
			return null;
		}

		return async e => {
			e.stopPropagation();
			e.preventDefault();

			if (disabled) {
				return;
			}

			const validationErrors = getValidationErrors(form.current);

			if (validationErrors) {
				addErrors(validationErrors);
				return;
			}

			try {
				setSubmitting(true);
				await onSubmit(getValues(form.current), e);
				await afterSubmit?.();
			} catch (err) {
				addErrors(err);
			} finally {
				setSubmitting(false);
			}
		};
	}, [form, disabled, addErrors, onSubmit, afterSubmit, setSubmitting]);
}

export function useSubmittable({
	disabled,
	onSubmit,
	afterSubmit,
	onChange,
	onValid,
	onInvalid,
}) {
	const form = useRef();

	const [{ errors, submitting }, dispatch] = useReducer(
		SubmittableReducer,
		getInitialState
	);

	const addErrors = useCallback(
		toAdd => dispatch({ type: AddErrors, errors: toAdd }),
		[dispatch]
	);

	const clearError = useCallback(
		name => dispatch({ type: ClearError, name }),
		[dispatch]
	);

	const setSubmitting = useCallback(
		s => dispatch({ type: SetSubmitting, submitting: s }),
		[dispatch]
	);

	return {
		ref: form,

		context: {
			errors,
			submitting,

			clearError,
		},

		handlers: {
			onChange: useChangeHandler({
				form,
				disabled,
				addErrors,
				onChange,
				onInvalid,
				onValid,
			}),
			onSubmit: useSubmitHandler({
				form,
				disabled,
				addErrors,
				onSubmit,
				afterSubmit,
				setSubmitting,
			}),
		},
	};
}
