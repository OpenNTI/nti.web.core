/** @typedef {import('../../../types.d.ts').AsProp} AsProp */

import React from 'react';
import cx from 'classnames';

import Theme from '../Placeholder.theme.css';

import { generator } from './generator';
import { Base } from './Base';

/**
 * @typedef {object} TextPlaceholderProps
 * @property {string} text Drives the width of the placeholder, if not set it will be 100%
 * @property {boolean} flat Turn off use the shimmer animation
 * @property {AsProp} as
 */

/**
 * @param {TextPlaceholderProps} props
 * @returns {JSX.Element}
 */
function TextPlaceholder({
	text,
	flat,
	as: Cmp = 'span',
	className,
	...otherProps
}) {
	return (
		<Cmp
			className={cx(className, Theme.text, { [Theme.full]: !text })}
			{...otherProps}
		>
			<span aria-hidden>{text || 'w'}</span>
			<Base flat={flat} />
		</Cmp>
	);
}

export const Text = generator(TextPlaceholder);
