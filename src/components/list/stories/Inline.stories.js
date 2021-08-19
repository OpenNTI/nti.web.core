import React from 'react';

import { InlineList } from '../Inline';

export default {
	title: 'Components/List/Inline',
	component: InlineList,
};

export const Base = () => (
	<InlineList>
		<span>Item 1</span>
		<span>Item 2</span>
		<span>Item 3</span>
	</InlineList>
);
