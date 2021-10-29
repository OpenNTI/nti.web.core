import { useCallback } from 'react';
import Picker from 'react-day-picker';

import { Button } from '../../../button/Button';
import { Chevron } from '../../../icons/Chevron';
import {
	isToday,
	MONTH_NAME_YEAR,
	DAY_OF_THE_MONTH,
	format,
} from '../../../date-time/utils/index';
import { Typography } from '../../../text/Text';

import DayPickerTheme from './DayPicker.theme.css';

/** @typedef {Date | Object | Date[] | (day: Date) => boolean} SelectedDays */

/**
 * @typedef {Object} DayPickerProps
 * @property {Date} value The selected date
 * @property {(Date) => void} onChange Callback when the selected date changes
 * @property {Date} initialMonth Which month to start the picker on
 * @property {SelectedDays} selectedDays Which days to select
 */

const getMonthYear = date => format(date, MONTH_NAME_YEAR);
const getDayOfMonth = date => format(date, DAY_OF_THE_MONTH);

const NavBar = ({
	month,
	previousMonth,
	nextMonth,
	onPreviousClick,
	onNextClick,
}) => (
	<>
		<Button
			className={DayPickerTheme.previousButton}
			title={getMonthYear(previousMonth)}
			onClick={onPreviousClick}
			transparent
			large
			p="sm"
		>
			<Chevron.Left skinny />
		</Button>
		<Button
			className={DayPickerTheme.nextButton}
			title={getMonthYear(nextMonth)}
			onClick={onNextClick}
			transparent
			large
			p="sm"
		>
			<Chevron.Right skinny />
		</Button>
	</>
);

const Caption = ({ date, onClick }) => (
	<Typography
		className={DayPickerTheme.caption}
		type="subhead-one"
		onClick={onClick}
		center
		pt="sm"
	>
		{getMonthYear(date)}
	</Typography>
);

const Weekday = ({ weekday, className, localeUtils, locale }) => {
	const name = localeUtils.formatWeekdayLong(weekday, locale);

	return (
		<Typography className={className} title={name}>
			{name.slice(0, 1)}
		</Typography>
	);
};

export const DayPickerProps = {
	classNames: DayPickerTheme,
	navbarElement: NavBar,
	captionElement: Caption,
	weekdayElement: Weekday,
	renderDay: date => <span>{getDayOfMonth(date)}</span>,
};

/**
 * Input to select a date from a calendar
 *
 * @param {DayPickerProps} props
 * @returns {JSX.Element}
 */
export function DayPicker({
	value,
	onChange,
	initialMonth,
	selectedDays: selectedDaysProp,
	...otherProps
}) {
	const isTodayValue = useCallback(day => isToday(value, day), [value]);

	const selectedDays = selectedDaysProp || isTodayValue;
	const handleDayClick = useCallback(
		(day, { disabled }, e) => {
			e.preventDefault();

			if (disabled || day == null) {
				return;
			}

			const clone = new Date(day.getTime());

			clone.setHours(0);
			clone.setMinutes(0);

			onChange?.(day);
		},
		[onChange]
	);

	return (
		<Picker
			{...DayPickerProps}
			{...otherProps}
			initialMonth={initialMonth}
			selectedDays={selectedDays}
			onDayClick={handleDayClick}
		/>
	);
}
