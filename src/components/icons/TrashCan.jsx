import React from 'react';
import PropTypes from 'prop-types';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

TrashCanIcon.propTypes = {
	fill: PropTypes.bool,
};
function TrashCanIcon({ fill, ...props }) {
	const icon = fill ? 'icon-delete' : 'icon-trash';

	return <FontIcon icon={icon} {...props} />;
}

export const TrashCan = setIcon(TrashCanIcon);
