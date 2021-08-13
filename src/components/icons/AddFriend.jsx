import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const icon = 'icon-addfriend';

function AddFriendIcon(props) {
	return <FontIcon icon={icon} {...props} />;
}

export const AddFriend = setIcon(AddFriendIcon);
