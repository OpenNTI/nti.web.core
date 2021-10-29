import { useState } from 'react';

import { DayPicker } from '../DayPicker';

export default {
	title: 'Components/Inputs/DayPicker',
	components: DayPicker,
};

export const Base = props => {
	const [date, setDate] = useState(new Date());

	return (
		<>
			<input />
			<DayPicker value={date} onChange={setDate} />
		</>
	);
};
