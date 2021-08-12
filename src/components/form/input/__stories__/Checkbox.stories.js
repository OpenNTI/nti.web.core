import React, { useState } from 'react';

import { Checkbox } from '../Checkbox';

export default {
	title: 'Components/Inputs/Checkbox',
	component: Checkbox,
	argTypes: {
		label: { control: { type: 'text' } },
		disabled: { control: { type: 'boolean' } },
		green: { control: { type: 'boolean' } },
	},
};

export const Base = props => {
	const [checked, setChecked] = useState();
	const onChange = e => setChecked(e.target.checked);

	return <Checkbox checked={checked} onChange={onChange} {...props} />;
};
