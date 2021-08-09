/** @typedef {import('./hooks/use-alignment').AlignmentProps} AlignmentProps */
/** @typedef {import('./hooks/use-alignment').Alignment} Alignment */
/**
 * @typedef {object} FlyoutProps
 * @property {Alignment} alignment
 * @property {boolean} arrow
 * @property {boolean} dark
 */
import cx from 'classnames';

import {
	PropMapper,
	StateGetter,
	ValueGetter,
} from '../../system/utils/PropGetters';

import Theme from './Flyout.theme.css';
import { Vertical } from './utils/alignment-axis';

const getStyleProps = PropMapper({
	primaryAxis: ValueGetter(
		({ primaryAxis = Vertical }) => `axis-${primaryAxis}`,
		['primaryAxis']
	),

	alignmentCls: ValueGetter(
		({ verticalAlign, horizontalAlign, alignment }) => {
			const classes = [];

			if (alignment.top != null) {
				classes.push('bottom');
			} else if (alignment.bottom != null) {
				classes.push('top');
			}

			if (!horizontalAlign || horizontalAlign === 'center') {
				classes.push('center');
			} else if (alignment.left != null) {
				classes.push('left');
			} else if (alignment.right != null) {
				classes.push('right');
			}

			return classes.join(' ');
		},
		['verticalAlign', 'horizontalAlign', 'alignment']
	),

	states: StateGetter(['arrow', 'dark']),
});

/**
 * @param {(AlignmentProps & FlyoutProps)} props
 * @returns {{className:string}}
 */
export function getFlyoutProps(props) {
	const { primaryAxis, alignmentCls, states, ...otherProps } =
		getStyleProps(props);

	return {
		className: cx(
			Theme.flyout,
			Theme[primaryAxis],
			Theme[alignmentCls],
			states.map(s => Theme[s])
		),
		...otherProps,
	};
}
