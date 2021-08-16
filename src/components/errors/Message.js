import React from 'react';
import cx from 'classnames';

import { Typography } from '../text/Text';

import Theme from './Errors.theme.css';
import { getMessage } from './utils/messages';

function ErrorMessageImpl({ error, className, ...otherProps }, ref) {
	const msg = error && getMessage(error);

	return (
		<Typography
			className={cx(className, Theme.errorMessage)}
			aria-hidden={msg ? 'false' : 'true'}
			color="error"
			{...otherProps}
		>
			{msg}
		</Typography>
	);
}

export const ErrorMessage = React.forwardRef(ErrorMessageImpl);
