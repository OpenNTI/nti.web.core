import { useRef, useCallback } from 'react';

const KeyToFocusDelta = {
	37: -1, //left
	38: -1, //up

	39: 1, //right
	40: 1, //down
};

export function useMenubarKeys(itemSelector, config) {
	if (!itemSelector) {
		throw new Error('useMenubarKeys must be given an item selector');
	}

	const { wrap = true } = config ?? {};

	const menuRef = useRef();
	const onKeyDown = useCallback(
		e => {
			const focusDelta = KeyToFocusDelta[e.keyCode];

			if (!menuRef.current || !focusDelta) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			const items = Array.from(
				menuRef.current.querySelectorAll(itemSelector)
			);

			const focusedIndex = items.findIndex(i => i.matches(':focus'));
			let next = focusedIndex + focusDelta;

			if (wrap && next >= items.length) {
				next = 0;
			}
			if (wrap && next < 0) {
				next = items.length - 1;
			}

			items[next]?.focus?.();
		},
		[itemSelector, wrap]
	);

	return { ref: menuRef, onKeyDown };
}
