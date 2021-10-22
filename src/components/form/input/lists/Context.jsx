import React, { useContext, useEffect } from 'react';

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
	useEffect(() => {
		const byValue = getOptionLabelsByValue(children);

		setSelected(value ? byValue[value] : null);
	}, [value, children]);

	return (
		<Context.Provider value={{ value, simple, onChange }}>
			{children}
		</Context.Provider>
	);
}
