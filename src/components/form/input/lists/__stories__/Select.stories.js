import { useState } from 'react';

import { Select } from '../Select';
import { Option } from '../Option';

export default {
	title: 'Components/Inputs/Select',
	component: Select,
};

export const Base = props => {
	const [selected, setSelected] = useState();

	return (
		<Select value={selected} onChange={setSelected}>
			<Option value="1">Option 1</Option>
			<Option value="2">Option 2</Option>
			<Option value="3">Option 3</Option>
		</Select>
	);
};
