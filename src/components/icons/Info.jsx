import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const icon = 'icon-info';

function InfoIcon(props) {
	return <FontIcon icon={icon} {...props} />;
}

export const Info = setIcon(InfoIcon);
