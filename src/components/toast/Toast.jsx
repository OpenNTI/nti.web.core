import React, { useRef, useEffect } from 'react';
import cx from 'classnames';

import { VariantGetter, PropMapper } from '../../system/utils/PropGetters';
import { Card } from '../box/Card';
import { Button } from '../button/Button';
import { X } from '../icons';
import { Typography } from '../text/Text';

import Theme from './Toast.theme.css';
import { useToastContext } from './Context';

const getToastProps = PropMapper({
	layout: VariantGetter(['card', 'bar', 'plain'], 'card', 'layout'),
});

function ToastLayout(props) {
	const {
		className,
		layout,
		title,
		icon,
		onDismiss,
		children,
		...otherProps
	} = getToastProps(props);

	return (
		<Card
			className={cx(className, Theme.toast, Theme[layout])}
			ph="md"
			{...otherProps}
		>
			{onDismiss && (
				<div className={Theme.controls}>
					<Button className={Theme.dismiss} plain onClick={onDismiss}>
						<X.Bold />
					</Button>
				</div>
			)}
			<div className={Theme.main}>
				{icon && <div className={Theme.icon}>{icon}</div>}
				{title && (
					<Typography className={Theme.title} variant="subhead-one">
						{title}
					</Typography>
				)}
				<div className={Theme.contents}>{children}</div>
			</div>
		</Card>
	);
}

export function Toast({ location, children, ...otherProps }) {
	const toastContext = useToastContext();
	const toastId = useRef();

	useEffect(() => {
		return () => toastContext.removeToast(toastId.current);
	}, []);

	useEffect(() => {
		const contents = <ToastLayout {...otherProps}>{children}</ToastLayout>;

		if (!toastId.current) {
			toastId.current = toastContext.getNextId();

			toastContext.addToast(toastId.current, {
				location,
				contents,
			});
		} else {
			toastContext.updateToast(toastId.current, {
				location,
				contents,
			});
		}
	}, [children, location]);

	return null;
}
