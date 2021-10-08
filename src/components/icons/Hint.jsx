import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const icon = 'icon-hint';

function HintIcon(props) {
	return <FontIcon icon={icon} {...props} />;
}

export const Hint = setIcon(HintIcon);
