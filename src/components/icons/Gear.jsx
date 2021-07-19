import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const Icon = 'icon-settings';

function GearIcon(props) {
	return <FontIcon icon={Icon} />;
}

export const Gear = setIcon(GearIcon);
