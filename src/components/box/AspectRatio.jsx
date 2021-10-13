/** @typedef {import('../../types').AsProp} AsProp */

import cx from 'classnames';

import Theme from './box.theme.css';
import { getBoxProps } from './get-box-props';

/**
 * @typedef {object} AspectRatioProps
 * @property {number} aspectRatio
 * @property {AsProp} as
 */

/**
 * Render a box with a given aspect ratio.
 *
 * @param {AspectRatio} props
 * @returns {JSX.Element}
 */
export function AspectRatio({
	className,
	aspectRatio = 1,
	as: Cmp = 'div',
	...props
}) {
	return (
		<Cmp
			{...getBoxProps({
				className: cx(className, Theme.aspectRatio),
				style: { '--aspect-raio': aspectRatio },
				...props,
			})}
		/>
	);
}
