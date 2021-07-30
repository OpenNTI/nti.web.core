// @ts-check
/** @typedef {import('../../system/types').EventHandler} EventHandler */
/** @typedef {import('../../system/types').AsProp} AsProp */
/** @typedef {import('./get-button-props').ButtonStyleProps} ButtonStyleProps */

/**
 * @typedef {object} ButtonCmpProps
 * @property {AsProp} [as='a'] - Cmp to render the button as
 * @property {boolean=} disabled - disallow triggering the button
 * @property {EventHandler=} onClick - callback when the button is triggered
 */

import React, { useCallback } from 'react';

import { Events } from '@nti/lib-commons';

import { getButtonStyleProps } from './get-button-props';

/**
 * Render a button
 *
 * @param {ButtonCmpProps & ButtonStyleProps} props
 * @param {React.} ref
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
	const handler = useCallback(
		e => {
			// This handler is called for clicks, and keyDown.
			// This filter only allows "clicks" from physical clicks and "keyDown" events from Space or Enter.
			if (disabled || !Events.isActionable(e)) {
				if (disabled) {
					e.preventDefault();

					//FIXME: disabled elements do not swallow events...
					// they simply do not act on them, and let the event to propagate
					e.stopPropagation();
				}
				return false;
			}

			onClick?.(e);
		},
		[disabled, onClick]
	);

	return (
		<Cmp
			{...getButtonStyleProps({ disabled, ...otherProps })}
			onKeyDown={handler}
			onClick={handler}
		/>
	);
}

export default React.forwardRef(Button);
