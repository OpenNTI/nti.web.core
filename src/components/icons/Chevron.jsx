import PropTypes from 'prop-types';
import cx from 'classnames';

import { Variant } from '../high-order/Variant';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const styles = stylesheet`
	.left {
		transform: rotate(270deg);
	}
	.right {
		transform: rotate(270deg);
	}
`;

const Down = 'down';
const Left = 'left';
const Right = 'right';
const Up = 'up';

const classes = {
	skinny: {
		[Down]: 'icon-chevrondown-25',
		[Left]: cx('icon-chevronup-25', styles.left),
		[Right]: cx('icon-chevrondown-25', styles.right),
		[Up]: 'icon-chevronup-25',
	},
	large: {
		[Down]: 'icon-chevron-down',
		[Left]: 'icon-chevron-left',
		[Right]: 'icon-chevron-right',
		[Up]: 'icon-chevron-up',
	},
	default: {
		[Down]: 'icon-chevron-down-10',
		[Left]: 'icon-chevron-left-10',
		[Right]: 'icon-chevron-right-10',
		[Up]: 'icon-chevron-up-10',
	},
};

ChevronIcon.Down = Variant(ChevronIcon, { direction: Down });
ChevronIcon.Left = Variant(ChevronIcon, { direction: Left });
ChevronIcon.Right = Variant(ChevronIcon, { direction: Right });
ChevronIcon.Up = Variant(ChevronIcon, { direction: Up });
ChevronIcon.propTypes = {
	direction: PropTypes.string,
	large: PropTypes.bool,
	skinny: PropTypes.bool,
};
function ChevronIcon({ direction = Down, large, skinny, ...props }) {
	const type = large ? 'large' : skinny ? 'skinny' : 'default';
	const icon = classes[type][direction];

	return <FontIcon icon={icon} {...props} />;
}

ChevronIcon.Down.propTypes = ChevronIcon.propTypes;
ChevronIcon.Left.propTypes = ChevronIcon.propTypes;
ChevronIcon.Right.propTypes = ChevronIcon.propTypes;
ChevronIcon.Up.propTypes = ChevronIcon.propTypes;

export const Chevron = setIcon(ChevronIcon);

Chevron.Down = setIcon(ChevronIcon.Down);
Chevron.Left = setIcon(ChevronIcon.Left);
Chevron.Right = setIcon(ChevronIcon.Right);
Chevron.Up = setIcon(ChevronIcon.Up);
