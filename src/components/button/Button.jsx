import React, { useCallback } from 'react';

import { Events } from '@nti/lib-commons';

import { getButtonProps } from './get-button-props';

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
			{...getButtonProps({ disabled, ...otherProps })}
			onKeyDown={handler}
			onClick={handler}
		/>
	);
}

export default React.forwardRef(Button);
