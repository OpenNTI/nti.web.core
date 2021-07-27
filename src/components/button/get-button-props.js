import React from 'react';
import cx from 'classnames';

import { getSpacingProps } from '../../system/css/get-spacing-props';
import { getBorderProps } from '../../system/css/get-border-props';
import {
	VariantGetter,
	StateGetter,
	PropGetter,
} from '../../system/utils/PropGetters';
import { isIcon } from '../icons';

import Theme from './Button.theme.css';

const getStyleProps = PropGetter({
	style: VariantGetter(
		['link', 'primary', 'secondary', 'destructive', 'constructive'],
		'primary'
	),

	size: VariantGetter(['medium'], 'medium', 'size'),

	state: StateGetter(['inverted', 'disabled', 'transparent']),
});

const SizeToDefaultSpacingProps = {
	medium: {
		pv: 'md',
		ph: 'lg',
	},
};

const isOnlyIcon = ({ children }) => {
	const kids = React.Children.toArray(children);

	return (
		kids.length === 1 &&
		//kids[0].type covers all usage in the app, checking the originalType is to make it work in MDX stories.
		(isIcon(kids[0].type) || isIcon(kids[0].props?.originalType))
	);
};

export function getButtonProps(props) {
	const { className, style, size, state, ...otherProps } =
		getStyleProps(props);

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
			state.map(s => Theme[s]),
			{
				[Theme.onlyIcon]: isOnlyIcon(props),
			}
		),
	};

	const spacingProps = getSpacingProps(
		buttonProps,
		SizeToDefaultSpacingProps[size] ?? {}
	);

	const borderProps = getBorderProps(spacingProps);

	return borderProps;
}
