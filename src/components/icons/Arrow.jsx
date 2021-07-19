import React from 'react';
import PropTypes from 'prop-types';

import Variant from '../HighOrderComponents/Variant';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const Up = 'up';
const UpRight = 'up-right';
// const Right = 'right';
// const DownRight = 'down-right';
const Down = 'down';
// const DownLeft= 'down-left';
// const Left = 'left';
// const UpLeft = 'up-left';

const classes = {
	[UpRight]: 'icon-launch',
};

const fillClasses = {
	[Up]: 'icon-moveup',
	[Down]: 'icon-movedown',
};

ArrowIcon.Up = Variant(ArrowIcon, { direction: Up });
ArrowIcon.UpRight = Variant(ArrowIcon, { direction: UpRight });
ArrowIcon.Down = Variant(ArrowIcon, { direction: Down });
ArrowIcon.propTypes = {
	direction: PropTypes.string,
	fill: PropTypes.bool,
};
export function ArrowIcon({ direction = UpRight, fill, ...otherProps }) {
	const icon = fill ? fillClasses[direction] : classes[direction];

	if (!icon) {
		return null;
	}

	return <FontIcon icon={icon} {...otherProps} />;
}

ArrowIcon.Up.propTypes = ArrowIcon.propTypes;
ArrowIcon.UpRight.propTypes = ArrowIcon.propTypes;
ArrowIcon.Down.propTypes = ArrowIcon.propTypes;

export const Arrow = setIcon(ArrowIcon);
