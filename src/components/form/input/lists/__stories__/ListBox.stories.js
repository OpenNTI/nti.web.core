import { useState } from 'react';

import { ListBox } from '../ListBox';
import { Option } from '../Option';

export default {
	title: 'Components/Inputs/ListBox',
	component: ListBox,
};

export const Base = props => {
	const [selected, setSelected] = useState();

	return (
		<ListBox value={selected} onChange={setSelected}>
			<Option value="1">A. Option 1</Option>
			<Option value="2">B. Option 2</Option>
			<Option value="3">C. Option 3</Option>
		</ListBox>
	);
};
