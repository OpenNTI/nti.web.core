import { useState } from 'react';

import { Number } from '../Number';

export default {
	title: 'Components/Inputs/Number',
	component: Number,
	argTypes: {
		placeholder: { control: { type: 'text' } },
		onChange: { action: 'changed' },
	},
};

export const Base = props => {
	const [value, setValue] = useState();
	const onChange = (...args) => {
		debugger;
		setValue(...args);
		props.onChange?.(...args);
	};

	return <Number {...props} value={value} onChange={onChange} />;
};
