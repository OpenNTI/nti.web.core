import { useLayoutEffect, useState } from 'react';

export default function useEscape(ref, { allowMarkup, text, ...otherProps }) {
	const [escaped, setEscaped] = useState(text);

	useLayoutEffect(
		() => {
			if (typeof text !== 'string' || allowMarkup) {
				if (escaped !== text) {
					setEscaped(text);
				}

				return;
			}

			const span = document.createElement('span');
			span.appendChild(document.createTextNode(text));
			setEscaped(span.innerHTML);
		},
		Array.isArray(text) ? text : [text]
	);

	return {
		...otherProps,
		allowMarkup,
		text: escaped,
	};
}
