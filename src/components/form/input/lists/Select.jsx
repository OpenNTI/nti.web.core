import { useCallback, useState } from 'react';

import {
	getInputStyleProps,
	getPlaceholderStyleProps,
} from '../get-input-props';
import { Text } from '../../../text/Text';
import { ChevronIcon } from '../../../icons/Chevron';

import { ListContext } from './Context';
import { TriggerInner } from './common';

const Trigger = styled.div`
	position: relative;
	display: inline-block;

	& > select {
		position: absolute;
		opacity: 0;
		inset: 0;
		width: 100%;
		height: 100%;
	}
`;

function SelectTrigger(props) {
	return <Trigger {...getInputStyleProps(props)} />;
}

export function Select({
	placeholder = 'Select an option...',
	children,

	value,
	onChange: onChangeProp,
}) {
	const [selected, setSelected] = useState();
	const label = selected ?? placeholder;

	const onChange = useCallback(
		e => onChangeProp(e.target.value, e),
		[onChangeProp]
	);

	return (
		<ListContext value={value} setSelected={setSelected} simple>
			<SelectTrigger>
				<TriggerInner>
					<Text
						limitLines={1}
						{...(selected ? {} : getPlaceholderStyleProps({}))}
					>
						{label}
					</Text>
					<ChevronIcon.Down large />
				</TriggerInner>
				<select
					value={selected}
					onChange={onChangeProp ? onChange : null}
				>
					{children}
				</select>
			</SelectTrigger>
		</ListContext>
	);
}
