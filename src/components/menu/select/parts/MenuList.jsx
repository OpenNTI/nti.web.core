import React, { useCallback, useRef } from 'react';
import cx from 'classnames';

import { useActionable } from '../../../button/hooks/use-actionable';
import { Check as CheckIcon } from '../../../icons/Check';
import Theme from '../Select.theme.css';
import { getTypographyProps } from '../../../../system/css/get-typography-props';
import { getSpacingProps } from '../../../../system/css/get-spacing-props';

const KeyToFocusDelta = {
	37: -1, //left
	38: -1, //up

	39: 1, //right
	40: 1, //down
};

function MenuItem({ option, getText, active, onClick }) {
	return (
		<li
			{...getTypographyProps(
				getSpacingProps(
					{
						className: cx(Theme.menuItem, {
							[Theme.selected]: active,
						}),
						tabIndex: '0',
						...useActionable(onClick),
					},
					{ pv: 'md', pl: 'xl', pr: 'lg' }
				),
				{ typography: 'body' }
			)}
		>
			{active && <CheckIcon className={Theme.check} />}
			<span>{getText(option)}</span>
		</li>
	);
}

export function MenuList({ options, value, getText, onChange }) {
	const listRef = useRef();
	const onKeyDown = useCallback(e => {
		const focusDelta = KeyToFocusDelta[e.keyCode];

		if (!listRef.current || !focusDelta) {
			return;
		}

		const options = Array.from(listRef.current.querySelectorAll('li'));

		const focusedIndex = options.findIndex(o => o.matches(':focus'));
		let next = focusedIndex + focusDelta;

		if (next >= options.length) {
			next = 0;
		}

		if (next < 0) {
			next = options.length - 1;
		}

		options[next]?.focus?.();
	}, []);

	return (
		<ul
			className={Theme.menu}
			role="menu"
			ref={listRef}
			onKeyDown={onKeyDown}
		>
			{options.map(option => (
				<MenuItem
					key={option}
					option={option}
					getText={getText}
					active={option === value}
					onClick={() => onChange(option)}
				/>
			))}
		</ul>
	);
}
