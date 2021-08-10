import React from 'react';

import { DisplayName } from '../DisplayName';

export default {
	title: 'Components/entity/DisplayName',
	component: DisplayName,
	argTypes: {
		entity: { control: 'text' },
	},
};

export const Base = props => <DisplayName {...props} />;
