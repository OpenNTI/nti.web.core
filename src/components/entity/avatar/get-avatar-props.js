import cx from 'classnames';

import {
	PropMapper,
	VariantGetter,
	StateGetter,
} from '../../../system/utils/PropGetters';
import { getBorderProps } from '../../../system/css/get-border-props';
import { getMarginProps } from '../../../system/css/get-spacing-props';

import Theme from './Avatar.theme.css';

const getStyleProps = PropMapper({
	size: VariantGetter(['small', 'medium', 'large'], 'medium', 'size'),

	states: StateGetter(['circular']),
});

export function getColorClass(entity) {
	function hash(str) {
		let h = 0,
			c;
		if (str.length === 0) {
			return h;
		}

		for (let i = 0; i < str.length; i++) {
			c = str.charCodeAt(i);
			h = (h << 5) - h + c;
			h = h & h; // Convert to 32bit integer
		}
		return h;
	}

	const NUM_COLORS = 12;

	let hashedString =
		(typeof entity === 'string' ? entity : entity?.Username) || 'unknown';

	let idx = Math.abs(hash(hashedString)) % NUM_COLORS;

	return `avatar-color-${idx}`;
}

export function getAvatarProps({ className, entity, ...props }) {
	const { size, states, ...otherProps } = getStyleProps(props);

	return getMarginProps(
		getBorderProps({
			className: cx(
				className,
				Theme.avatar,
				Theme[size],
				getColorClass(entity),
				states.map(s => Theme[s])
			),
			...otherProps,
		})
	);
}
