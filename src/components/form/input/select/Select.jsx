import { useEffect, useRef } from 'react';
import cx from 'classnames';

import { Flyout } from '../../../flyout/Flyout';
import { ChevronIcon } from '../../../icons/Chevron';
import { MenuList } from '../../../menu/list/List';
import * as Option from '../../../menu/list/Option';
import { Text } from '../../../text/Text';
import { getInputStyleProps } from '../get-input-props';
import InputTheme from '../Input.theme.css';

const identity = x => x;

const TriggerInner = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	gap: 0.25rem;
`;

function SelectTriggerInner({
	value,
	options,
	getText = identity,
	placeholder,
	...otherProps
}) {
	const selected = value
		? (options ?? []).find(o => Option.getValue(o) === value)
		: null;

	return (
		<TriggerInner>
			<Text
				limitLines={1}
				className={cx({ [InputTheme.placeholder]: !selected })}
			>
				{selected ? Option.getLabel(selected) : placeholder}
			</Text>
			<ChevronIcon.Down large />
		</TriggerInner>
	);
}

export function Select({
	value,
	options,
	getText = identity,
	placeholder,
	name,

	onChange,

	autoFocus,
	...otherProps
}) {
	const triggerRef = useRef();

	useEffect(() => {
		if (autoFocus) {
			triggerRef.focus?.();
		}
	}, []);

	return (
		<Flyout horizontalAlign="left-or-right" autoDismissOnAction>
			<Flyout.Trigger
				ref={triggerRef}
				variant="plain"
				disabled={!options?.length}
				{...getInputStyleProps(otherProps)}
			>
				<SelectTriggerInner
					value={value}
					options={options}
					getText={getText}
					placeholder={placeholder}
					{...otherProps}
				/>
			</Flyout.Trigger>
			<Flyout.Content>
				<MenuList
					options={options}
					getText={getText}
					value={value}
					onChange={onChange}
				/>
			</Flyout.Content>
		</Flyout>
	);
}
