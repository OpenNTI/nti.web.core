import React from 'react';

import { Avatar } from '../avatar/Avatar';

export default {
	title: 'Components/entity/Avatar',
	component: Avatar,
	argTypes: {
		entity: { control: 'text' },
	},
};

export const Base = props => <Avatar {...props} />;
