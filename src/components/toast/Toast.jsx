import React, { useRef, useEffect } from 'react';

import { useToastContext } from './Context';

export function Toast({ children, location }) {
	const toastContext = useToastContext();
	const toastId = useRef();

	useEffect(() => {
		return () => toastContext.removeToast(toastId.current);
	}, []);

	useEffect(() => {
		if (!toastId.current) {
			toastId.current = toastContext.getNextId();

			toastContext.addToast({
				id: toastId.current,
				location,
				contents: React.Children.only(children),
			});
		} else {
			toastContext.updateToast(toastId.current, {
				location,
				contents: React.Children.only(children),
			});
		}
	}, [children, location]);

	return null;
}
