import { useEffect, useState } from 'react';
import cx from 'classnames';

const styles = stylesheet`
	.multi-line-limit {
		display: -webkit-box !important;
		-webkit-line-clamp: var(--line-limit);
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		max-height: calc(var(--line-limit) * var(--line-height));

		/* The eventual standard:
		https://drafts.csswg.org/css-overflow-3/#propdef-line-clamp */
		line-clamp: var(--line-limit) "…";
	}

	.single-line-limit {
		display: inline-block;
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
`;

export default function useLimitLines(
	ref,
	{ className, style, limitLines: limit, ...otherProps }
) {
	const [lineHeight, setLineHeight] = useState('1em');

	const isSingleLine = limit === 1;
	const isMultiLine = limit > 1;

	useEffect(() => {
		if (isMultiLine) {
			setLineHeight(getComputedStyle(ref.current).lineHeight);
		}
	}, [className]);

	return {
		...otherProps,
		className: cx(className, {
			[styles.multiLineLimit]: isMultiLine,
			[styles.singleLineLimit]: isSingleLine,
		}),
		style: {
			...style,
			...(isMultiLine
				? { '--line-limit': limit, '--line-height': lineHeight }
				: null),
		},
	};
}
