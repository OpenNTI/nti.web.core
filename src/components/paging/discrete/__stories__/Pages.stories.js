import React from 'react';

import { DiscretePages } from '../Pages';

export default {
	title: 'Components/Paging/DiscretePages',
	component: DiscretePages,
	argTypes: {
		total: { control: { type: 'number' } },
		selected: { control: { type: 'number' } },
		maxDisplay: { control: { type: 'number' } },
		load: { action: 'load-page' },
	},
};

export const Base = props => <DiscretePages {...props} />;
