import PropTypes from 'prop-types';

import { Variant } from '../high-order/Variant';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const Slash = 'slash';
const NoSlash = 'no-slash';

const classes = {
	[Slash]: 'icon-hide',
	[NoSlash]: 'icon-view',
};

EyeIcon.Slash = Variant(EyeIcon, { variant: Slash });
EyeIcon.propTypes = {
	variant: PropTypes.string,
};
function EyeIcon({ variant = NoSlash, ...props }) {
	const icon = classes[variant];

	return <FontIcon icon={icon} {...props} />;
}

export const Eye = setIcon(EyeIcon);
