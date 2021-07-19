import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

function ShareIcon(props) {
	return <FontIcon icon="icon-share" {...props} />;
}

export const Share = setIcon(ShareIcon);
