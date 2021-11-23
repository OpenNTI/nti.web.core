import { useCallback, useState } from 'react';

import {
	getInputStyleProps,
	getPlaceholderStyleProps,
} from '../get-input-props';
import { setInput } from '../utils/identity';
import { Text } from '../../../text/Text';
import { Chevron } from '../../../icons/Chevron';

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

	...otherProps
}) {
	const [selected, setSelectedState] = useState();
	const onChange = useCallback(
		e => onChangeProp(e.target.value, e),
		[onChangeProp]
	);

	const setSelected = useCallback(
		(label, value) => setSelectedState({ label, value }),
		[setSelectedState]
	);

	return (
		<SelectTrigger {...otherProps}>
			<TriggerInner>
				<Text
					limitLines={1}
					{...(selected ? {} : getPlaceholderStyleProps({}))}
				>
					{selected?.label ?? placeholder}
				</Text>
				<Chevron.Down large />
			</TriggerInner>
			<ListContext value={value} setSelected={setSelected} simple>
				<select
					value={selected?.value}
					onChange={onChangeProp ? onChange : null}
				>
					{children}
				</select>
			</ListContext>
		</SelectTrigger>
	);
}

setInput(Select);
