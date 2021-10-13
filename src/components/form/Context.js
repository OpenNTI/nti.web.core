import { createContext, useContext } from 'react';

const Context = createContext();

export const useFormContext = () => useContext(Context);

export function FormContext({ submitting, errors, ...otherProps }) {
	return <Context.Provider value={{ submitting, errors }} {...otherProps} />;
}
