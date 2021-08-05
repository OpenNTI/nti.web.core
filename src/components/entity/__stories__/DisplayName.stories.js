import React from 'react';

import { DisplayName } from '../DisplayName';

export default {
	title: 'DisplayName',
	component: DisplayName,
	argTypes: {
		entity: { control: 'text' },
	},
};

export const Base = props => <DisplayName {...props} />;
