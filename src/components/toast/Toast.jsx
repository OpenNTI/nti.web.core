import React, { useRef, useEffect } from 'react';
import cx from 'classnames';

import { VariantGetter, PropMapper } from '../../system/utils/PropGetters';
import { Card } from '../box/Card';
import { Button } from '../button/Button';
import { X, Alert } from '../icons';
import { Typography } from '../text/Text';

import Theme from './Toast.theme.css';
import { useToastContext } from './Context';

const getToastProps = PropMapper({
	layout: VariantGetter(['card', 'bar', 'plain'], 'card', 'layout'),
	level: VariantGetter(['info', 'warning', 'error'], 'info', 'level'),
});

function ToastLayout(props) {
	const {
		className,
		layout,
		level,
		title,
		icon = <Alert />,
		onDismiss,
		children,
		...otherProps
	} = getToastProps(props);

	if (layout === 'plain') {
		return <Card {...otherProps}>{children}</Card>;
	}

	return (
		<Card
			className={cx(className, Theme.toast, Theme[layout], Theme[level])}
			pl="md"
			pb="sm"
			{...otherProps}
		>
			{onDismiss && (
				<Button className={Theme.dismiss} plain onClick={onDismiss}>
					<X.Bold />
				</Button>
			)}
			{icon && <div className={Theme.icon}>{icon}</div>}
			{title && (
				<Typography className={Theme.title} type="subhead-one">
					{title}
				</Typography>
			)}
			<Typography type="body" as="div" className={Theme.contents}>
				{children}
			</Typography>
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
