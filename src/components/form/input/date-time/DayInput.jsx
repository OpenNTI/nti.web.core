import React, { useCallback, useRef, useState, useEffect } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';

import {
	DATE_PADDED,
	format as formatDate,
	parse as parseDate,
} from '../../../date-time/utils/index';
import { Flyout } from '../../../flyout/Flyout';
import { getInputStyleProps } from '../get-input-props';

import { DayPickerProps } from './DayPicker';

function DayInputOverlay({ input, children, classNames, ...props }) {
	const child = React.Children.only(children);
	const dayPickerProps = {
		...props,
		...DayPickerProps,
		classNames: {
			...classNames,
			...DayPickerProps.classNames,
		},
	};

	return (
		<Flyout.Content alignTo={input} horizontalAlign="left-or-right" open>
			{React.cloneElement(child, { ...dayPickerProps })}
		</Flyout.Content>
	);
}

export function DayInput({
	value,
	onChange,
	format = DATE_PADDED,
	...otherProps
}) {
	const [inputValue, setInputValue] = useState();
	const valueRef = useRef();

	useEffect(() => {
		if (value !== valueRef.current) {
			setInputValue(value);
		}
	}, [value]);

	const onDayChange = useCallback(
		(date, ...args) => {
			valueRef.current = date;
			onChange?.(date, ...args);
		},
		[onChange, inputValue]
	);

	const parseInput = useCallback(
		(date, f, locale) => parseDate(date, f, { locale }),
		[]
	);

	return (
		<DayPickerInput
			value={inputValue}
			onDayChange={onDayChange}
			format={format}
			formatDate={formatDate}
			parseDate={parseInput}
			placeholder={`${formatDate(new Date(), format)}`}
			inputProps={getInputStyleProps(otherProps)}
			overlayComponent={DayInputOverlay}
		/>
	);
}
