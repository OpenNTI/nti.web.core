import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

function PencilIcon(props) {
	return <FontIcon icon="icon-edit" {...props} />;
}

export const Pencil = setIcon(PencilIcon);
