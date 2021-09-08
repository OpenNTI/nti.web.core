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

// We need a block element within the button to counter-act the descender space...
// AsyncAction can use this to move the label
export const ButtonLabel = ({ children }) => (
	<div data-button-label>{children}</div>
);

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
		children,

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
		>
			{hasLabel(children) ? (
				children
			) : (
				<ButtonLabel>{children}</ButtonLabel>
			)}
		</Cmp>
	);
}

export const Button = React.forwardRef(ButtonImpl);

function hasLabel(children) {
	for (let child of React.Children.toArray(children)) {
		if (typeof child !== 'object') continue;
		if (
			('type' in child && child?.type === ButtonLabel) ||
			('children' in child && hasLabel(child.children))
		) {
			return true;
		}
	}
	return false;
}
