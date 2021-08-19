import { useLayoutEffect, useState } from 'react';

export default function useEscape(ref, { allowMarkup, text, ...otherProps }) {
	const [escaped, setEscaped] = useState(text);
	const shouldEscape = typeof text === 'string' && !allowMarkup;

	useLayoutEffect(() => {
		if (!shouldEscape) {
			return;
		}

		const span = document.createElement('span');
		span.appendChild(document.createTextNode(text));
		setEscaped(span.innerHTML);
	}, [text]);

	return {
		...otherProps,
		allowMarkup,
		text: shouldEscape ? escaped : text,
	};
}
