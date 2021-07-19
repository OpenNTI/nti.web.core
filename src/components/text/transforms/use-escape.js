import { useLayoutEffect, useState } from 'react';

export default function useEscape(ref, { allowMarkup, text, ...otherProps }) {
	const [escaped, setEscaped] = useState(text);

	useLayoutEffect(() => {
		if (typeof text !== 'string' || allowMarkup) {
			setEscaped(text);
			return;
		}

		const span = document.createElement('span');
		span.appendChild(document.createTextNode(text));
		setEscaped(span.innerHTML);
	}, [text]);

	return {
		...otherProps,
		allowMarkup,
		text: escaped,
	};
}
