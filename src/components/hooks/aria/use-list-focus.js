import { useCallback, useRef } from 'react';

//Heavily inspired by:
//https://github.com/adobe/react-spectrum/blob/a25cdbabe81735021d4a790ca540dfc3d01defe1/packages/%40react-aria/selection/src/useSelectableCollection.ts#L100
//https://github.com/adobe/react-spectrum/blob/a25cdbabe81735021d4a790ca540dfc3d01defe1/packages/%40react-aria/selection/src/useTypeSelect.ts#L42

function getKeyboardNav(e, focusedIndex, itemCount, wrap) {
	let next = focusedIndex;

	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowLeft': {
			if (next == null) {
				//If nothing is focused focused the last element
				next = itemCount - 1;
			} else {
				//else move the focus up one element
				next = next - 1;
			}

			break;
		}

		case 'ArrowDown':
		case 'ArrowRight': {
			if (next == null) {
				next = 0;
			} else {
				next = next + 1;
			}
			break;
		}

		case 'Home':
		case 'PageUp': {
			next = 0;
			break;
		}

		case 'End':
		case 'PageDown': {
			next = itemCount - 1;
		}
	}

	if (next < 0) {
		next = wrap ? itemCount - 1 : 0;
	}

	if (next >= itemCount) {
		next = wrap ? 0 : itemCount - 1;
	}

	return next;
}

function getCharacter(e) {
	const { key } = e;
	const char = key.length === 1 && /[A-Z]/i.test(key) ? key : '';

	if (!char || e.ctrlKey || e.metaKey) {
		return null;
	}

	return char;
}

const ClearBufferTimeout = 500;

export function useListFocus(itemSelector, config = {}) {
	if (!itemSelector) {
		throw new Error('useSelectableList must be given an item selector');
	}

	const {
		wrap = true,

		isFocused = (item, parent) => item.matches(':focus'),
		focus = (item, parent) => item.focus(),

		matchesSearch = (search, item, parent) => {
			const match =
				item.getAttribute('data-option-match') ?? item.textContent;

			return match.toLowerCase().indexOf(search.toLowerCase()) === 0;
		},
	} = config ?? {};

	const list = useRef();
	const search = useRef({ buffer: '', timeout: null });

	const onKeyDown = useCallback(
		e => {
			if (!list.current) {
				return;
			}

			const items = Array.from(
				list.current.querySelectorAll(itemSelector)
			);
			const focusedIndex = items.findIndex(i =>
				isFocused(i, list.current)
			);

			const next = getKeyboardNav(e, focusedIndex, items.length, wrap);

			if (next !== focusedIndex) {
				e.preventDefault();
				e.stopPropagation();

				focus(items[next], list.current);
				return;
			}

			const char = getCharacter(e);

			if (!char) {
				return;
			}
			if (char === ' ' && search.current.buffer.length > 0) {
				e.preventDefault();
			}

			search.current.buffer += char;

			clearTimeout(search.current.timeout);
			search.current.timeout = setTimeout(
				() => (search.current.buffer = ''),
				ClearBufferTimeout
			);

			const match = items.find(i =>
				matchesSearch(search.current.buffer, i, list.current)
			);

			if (match) {
				e.preventDefault();
				e.stopPropagation();
				focus(match, list.current);
			}
		},
		[itemSelector, wrap, isFocused, focus]
	);

	return { ref: list, onKeyDown };
}
