/** @typedef {import('../../../types.d.ts').AsProp} AsProp */
/** @typedef {import('../../box/AspectRatio').AspectRatioProps} AspectRatioProps */

import React from 'react';
import cx from 'classnames';

import { getMarginProps } from '../../../system/css/get-spacing-props';
import { getBorderProps } from '../../../system/css/get-border-props';
import { AspectRatio } from '../../box/AspectRatio';
import Theme from '../Placeholder.theme.css';

import { generator } from './generator';
import { Base } from './Base';

/**
 * @typedef {object} ImagePlaceholderProps
 * @property {string} text Drives the width of the placeholder, if not set it will be 100%
 * @property {boolean} flat Turn off use the shimmer animation
 * @property {AsProp} as
 */

/**
 * Render a placeholder for an image with a given aspect ratio
 *
 * @param {(ImagePlaceholderProps & AspectRatioProps)} param0
 * @returns {JSX.Element}
 */
function ImagePlaceholder({
	className,
	aspectRatio,
	as: Cmp = 'div',
	flat,
	...otherProps
}) {
	const Wrapper = aspectRatio != null ? AspectRatio : Cmp;
	const wrapperProps = {};

	if (aspectRatio != null) {
		wrapperProps.aspectRatio = aspectRatio;
	}

	return (
		<Wrapper
			{...getMarginProps(
				getBorderProps({
					className: cx(className, Theme.image),
					...wrapperProps,
				})
			)}
		>
			<Base flat={flat} />
		</Wrapper>
	);
}

export const Image = generator(ImagePlaceholder);
