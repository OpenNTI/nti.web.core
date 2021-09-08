// @ts-check
/** @typedef {import('../../types').EventHandler} EventHandler */
/** @typedef {import('../../types').AsProp} AsProp */
/** @typedef {import('./get-button-props').ButtonStyleProps} ButtonStyleProps */

/**
 * @typedef {object} ButtonCmpProps
 * @property {AsProp=} as - Cmp to render the button as. Defaults to a <button> or an <a> if href is given.
 * @property {boolean=} disabled - disallow triggering the button
 * @property {boolean=} busy - indicate that the button's action has been triggered
 * @property {string=} href - Link url
 * @property {EventHandler=} onClick - callback when the button is triggered
 */

/** @typedef {(ButtonCmpProps & ButtonStyleProps)} ButtonProps */

import React from 'react';

import { filterProps } from '../utils/filter-props';

import { getButtonStyleProps } from './get-button-props';
import { useActionable } from './hooks/use-actionable';

/**
 * Render a button
 *
 * @param {ButtonProps} props
 * @param {React.Ref<any>} ref
 * @returns {JSX.Element}
 */
function ButtonImpl(
	{
		as,
		disabled,
		busy,

		onClick,

		...otherProps
	},
	ref
) {
	const Cmp = as ?? (otherProps.href ? 'a' : 'button');

	return (
		<Cmp
			ref={ref}
			tabIndex={0}
			{...filterProps(
				getButtonStyleProps({
					disabled,
					busy,
					...otherProps,
				}),
				Cmp
			)}
			{...useActionable(onClick, { disabled: disabled || busy })}
		/>
	);
}

export const Button = React.forwardRef(ButtonImpl);
