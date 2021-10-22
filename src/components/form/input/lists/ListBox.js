import { useState, useRef, useEffect } from 'react';

import { Flyout } from '../../../flyout/Flyout';
import { useListFocus } from '../../../hooks/aria/use-list-focus';
import { ChevronIcon } from '../../../icons/Chevron';
import { Text } from '../../../text/Text';
import {
	getInputStyleProps,
	getPlaceholderStyleProps,
} from '../get-input-props';

import { TriggerInner } from './common';
import { ListContext } from './Context';
import { OptionSelector } from './Option';

export function ListBox({
	placeholder = 'Select an option...',
	children,

	value,
	onChange,

	autoFocus,

	...otherProps
}) {
	const [selected, setSelected] = useState();
	const label = selected ?? placeholder;

	const triggerRef = useRef();

	useEffect(() => {
		if (autoFocus) {
			triggerRef.current?.focus?.();
		}
	}, []);

	return (
		<ListContext
			value={value}
			setSelected={setSelected}
			onChange={onChange}
		>
			<Flyout horizontalAlign="left-or-right" autoDismissOnAction>
				<Flyout.Trigger
					ref={triggerRef}
					variant="plain"
					{...getInputStyleProps(otherProps)}
				>
					<TriggerInner>
						<Text
							limitLines={1}
							{...(selected ? {} : getPlaceholderStyleProps({}))}
						>
							{label}
						</Text>
						<ChevronIcon.Down large />
					</TriggerInner>
				</Flyout.Trigger>
				<Flyout.Content>
					<div data-id="test" {...useListFocus(OptionSelector)}>
						{children}
					</div>
				</Flyout.Content>
			</Flyout>
		</ListContext>
	);
}
