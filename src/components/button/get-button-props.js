//@ts-check
/** @typedef {import('../../system/css/get-spacing-props').SpacingProps} SpacingProps */
/** @typedef {import('../../system/css/get-border-props').BorderProps} BorderProps */
/** @typedef {'link' | 'primary' | 'secondary' | 'destructive' | 'constructive'} ButtonStyleVariant */
/** @typedef {'medium'} SizeVariant */

/**
 * @typedef {object} ButtonStyleConfig
 * @property {ButtonStyleVariant=} variant - which style of button
 * @property {boolean=} link - inline text treatment (no padding)
 * @property {boolean=} destructive - action will cause an object to be deleted/destroyed
 * @property {boolean=} constructive - action will cause an object to be created
 * @property {boolean=} primary - main action in a set
 * @property {boolean=} secondary - auxillary actions in a set
 * @property {SizeVariant=} size - how large the button should be
 * @property {boolean=} medium
 * @property {boolean=} inverted - invert the color scheme
 * @property {boolean=} disabled - disallow triggering
 * @property {boolean=} transparent - maintain padding, but have no background on the button
 */

/** @typedef {React.ComponentPropsWithoutRef<'button'> & ButtonStyleConfig & SpacingProps & BorderProps} ButtonStyleProps */

import React from 'react';
import cx from 'classnames';

import { getSpacingProps } from '../../system/css/get-spacing-props';
import { getBorderProps } from '../../system/css/get-border-props';
import {
	VariantGetter,
	StateGetter,
	PropMapper,
} from '../../system/utils/PropGetters';
import { isIcon } from '../icons';

import Theme from './Button.theme.css';

const getStyleProps = PropMapper({
	style: VariantGetter(
		['link', 'primary', 'secondary', 'destructive', 'constructive'],
		'primary'
	),

	size: VariantGetter(['medium', 'header'], 'medium', 'size'),

	state: StateGetter(['inverted', 'disabled', 'transparent']),
});

/** @type {Record<string, SpacingProps>}}} */
const SizeToDefaultSpacingProps = {
	medium: {
		pv: 'md',
		ph: 'lg',
	},
	header: {
		pv: 'md',
		ph: 'sm',
	},
};

/**
 * @param {React.ComponentPropsWithoutRef<any>} props
 * @returns {boolean}
 */
const isOnlyIcon = ({ children }) => {
	const [kid, ...others] = React.Children.toArray(children);

	if (others.length > 0 || !kid || typeof kid !== 'object') {
		return false;
	}

	if (Array.isArray(kid)) {
		return isOnlyIcon({ children: kid });
	}

	return (
		//kids[0].type covers all usage in the app
		('type' in kid && isIcon(kid.type)) ||
		//checking the originalType is to make it work in MDX stories.
		('props' in kid && isIcon(kid.props.originalType))
	);
};

/**
 * Get the props to apply the configured button styles.
 *
 * @param {ButtonStyleProps} props
 * @returns {{className:string}}
 */
export function getButtonStyleProps(props) {
	const {
		className,
		style,
		size,
		state = [],
		...otherProps
	} = getStyleProps(props);

	if (style === 'link') {
		return { className: cx(Theme[style], className), ...otherProps };
	}

	const buttonProps = {
		...otherProps,
		className: cx(
			className,
			Theme.button,
			Theme[style],
			Theme[size],
			state?.map?.(s => Theme[s]),
			{
				[Theme.onlyIcon]: isOnlyIcon(props),
			}
		),
	};

	const spacingProps = getSpacingProps(
		buttonProps,
		SizeToDefaultSpacingProps[size]
	);

	const borderProps = getBorderProps(spacingProps);

	return borderProps;
}
