import React, { useRef } from 'react';

import useLimitLines from './use-limit-lines';
import useLinkify from './use-linkify';
import useTranslate from './use-translate';

function getText(childrenProp) {
	let children;

	try {
		children = React.Children.toArray(childrenProp);
	} catch {
		children = [];
	}

	let text = '';

	for (let child of children) {
		if (typeof child === 'string') {
			text += child;
		} else {
			return children;
		}
	}

	return text;
}

export default function useTransforms({ children, ...props }) {
	const ref = useRef();

	let transformedProps = { ...props, text: getText(children), ref };

	transformedProps = useTranslate(ref, transformedProps);
	transformedProps = useLinkify(ref, transformedProps);
	transformedProps = useLimitLines(ref, transformedProps);

	return [ref, transformedProps];
}
