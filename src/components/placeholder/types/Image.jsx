/** @typedef {import('../../../types.d.ts').AsProp} AsProp */
/** @typedef {import('../../box/AspectRatio').AspectRatioProps} AspectRatioProps */

import React from 'react';
import cx from 'classnames';

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
function ImagePlaceholder({ className, aspectRatio, flat, ...otherProps }) {
	return (
		<AspectRatio
			aspectRatio={aspectRatio}
			className={cx(className, Theme.image)}
		>
			<Base flat={flat} />
		</AspectRatio>
	);
}

export const Image = generator(ImagePlaceholder);
