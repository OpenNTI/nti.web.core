// @ts-check
/** @typedef {import('../../types').EventHandler} EventHandler */
/** @typedef {import('../../types').AsProp} AsProp */
/** @typedef {import('./get-button-props').ButtonStyleProps} ButtonStyleProps */

/**
 * @typedef {object} ButtonCmpProps
 * @property {AsProp} [as='a'] - Cmp to render the button as
 * @property {boolean=} disabled - disallow triggering the button
 * @property {EventHandler=} onClick - callback when the button is triggered
 */

import React from 'react';

import { getButtonStyleProps } from './get-button-props';
import { useActionable } from './hooks/use-actionable';

/**
 * Render a button
 *
 * @param {ButtonCmpProps & ButtonStyleProps} props
 * @param {React.Ref<Button>} ref
 * @returns {JSX.Element}
 */
function Button(
	{
		as: Cmp = 'a',
		disabled,
		onClick,

		...otherProps
	},
	ref
) {
	return (
		<Cmp
			ref={ref}
			tabIndex={0}
			{...getButtonStyleProps({ disabled, ...otherProps })}
			{...useActionable(onClick, { disabled })}
		/>
	);
}

export default React.forwardRef(Button);
