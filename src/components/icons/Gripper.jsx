import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

function GripperIcon(props) {
	return <FontIcon icon="icon-gripper" {...props} />;
}

export const Gripper = setIcon(GripperIcon);
