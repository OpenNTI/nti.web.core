import { useState } from 'react';

import { Text } from '../Text';

export default {
	title: 'Components/Inputs/Text',
	component: Text,
	argTypes: {
		placeholder: { control: { type: 'text' } },
		onChange: { action: 'changed' },
	},
};

export const Base = props => {
	const [value, setValue] = useState();
	const onChange = (...args) => (
		setValue(...args), props.onChange?.(...args)
	);

	return <Text value={value} onChange={onChange} {...props} />;
};
