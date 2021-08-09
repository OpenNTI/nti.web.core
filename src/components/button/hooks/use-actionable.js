/** @typedef {import('../../types.d.ts').EventHandler} EventHandler */
import { useCallback } from 'react';

import { Events } from '@nti/lib-commons';

/**
 * Return the props needed to trigger a callback from user interaction on an element.
 *
 * @param {EventHandler} action
 * @param {object} config
 * @param {boolean} config.disabled
 * @param {EventHandler} config.onClick
 * @param {EventHandler} config.onKeyDown
 * @returns {{onClick: EventHandler, onKeyDown: EventHandler}}
 */
export function useActionable(action, { disabled, onClick, onKeyDown }) {
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

			action?.(e);
		},
		[disabled, action]
	);

	const onClickHandler = useCallback(
		e => (onClick?.(e), handler(e)),
		[handler, onClick]
	);
	const onKeyDownHandler = useCallback(
		e => (onKeyDown?.(e), handler(e)),
		[handler, onKeyDown]
	);

	return { onClick: onClickHandler, onKeyDown: onKeyDownHandler };
}
