import React, { useContext, useEffect, useRef } from 'react';

import { getOptionLabelsByValue } from './utils/options';

const Context = React.createContext();

export const useListContext = () => useContext(Context);
export function ListContext({
	optionChildren,
	value,
	setSelected,
	onChange,

	simple,
	children,
}) {
	const selectedRef = useRef();
	const labelRef = useRef();

	useEffect(() => {
		const byValue = getOptionLabelsByValue(children);

		const label = byValue[value];

		if (selectedRef.current !== value || labelRef.current !== label) {
			setSelected(value ? byValue[value] : null, value);
		}

		selectedRef.current = value;
		labelRef.current = label;
	}, [value, children]);

	return (
		<Context.Provider value={{ value, simple, onChange }}>
			{children}
		</Context.Provider>
	);
}
