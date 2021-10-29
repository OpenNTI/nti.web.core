import { useState } from 'react';

import { DayInput } from '../DayInput';

export default {
	title: 'Components/Inputs/DayInput',
	components: DayInput,
	argTypes: {
		onChange: { action: 'onChange' },
	},
};

export const Base = ({ onChange }) => {
	const [date, setDate] = useState(new Date());

	const changeDate = date => {
		setDate(date);
		onChange(date);
	};

	return (
		<>
			<input />
			<DayInput value={date} onChange={changeDate} />
		</>
	);
};
