import { useState } from 'react';

import { Duration } from '../Duration';

export default {
	title: 'Components/Inputs/Duration',
	components: Duration,
	argTypes: {
		onChange: { action: 'onChange' },
	},
};

export const Base = props => {
	const [duration, setDuration] = useState();
	const onChange = (...args) => {
		setDuration(...args);
		props.onChange?.(...args);
	};

	return <Duration {...props} value={duration} onChange={onChange} />;
};
