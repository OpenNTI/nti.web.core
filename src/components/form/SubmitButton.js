
import { Button } from '../button/Button';

import { useFormContext } from './Context';

export function SubmitButton(props) {
	const formContext = useFormContext() ?? {};
	const { submitting } = formContext;

	const submitProps = {};

	if (submitting) {
		submitProps.busy = true;
	}

	return <Button {...submitProps} {...props} />;
}
