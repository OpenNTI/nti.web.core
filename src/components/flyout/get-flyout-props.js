/** @typedef {import('./hooks/use-alignment').AlignmentProps} AlignmentProps */
/** @typedef {import('./hooks/use-alignment').Alignment} Alignment */
/**
 * @typedef {object} FlyoutProps
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
		({ primaryAxis = Vertical }) => `${primaryAxis}-axis`,
		['primaryAxis']
	),

	alignmentClasses: ValueGetter(
		({ alignment }) => {
			if (!alignment || alignment.aligning) {
				return [];
			}

			const classes = [];

			if (alignment.top != null) {
				classes.push('bottom');
			} else if (alignment.bottom != null) {
				classes.push('top');
			}

			if (
				!alignment.horizontalAlign ||
				alignment.horizontalAlign === 'center'
			) {
				classes.push('center');
			} else if (alignment.left != null) {
				classes.push('left');
			} else if (alignment.right != null) {
				classes.push('right');
			}

			return classes;
		},
		['alignment']
	),

	states: StateGetter(['arrow', 'dark', 'constrain']),
});

const StatesToClass = {
	arrow: Theme.hasArrow,
};

/**
 * @param {(AlignmentProps & FlyoutProps & {alignment: Alignment})} props
 * @returns {{className:string}}
 */
export function getFlyoutProps(props) {
	const { alignment } = props;
	const { primaryAxis, alignmentClasses, states, styles, ...otherProps } =
		getStyleProps(props);

	const flyoutStyles = {
		...(styles ?? {}),
	};

	if (alignment.alignTo) {
		flyoutStyles[
			'--flyout-align-width'
		] = `${alignment.alignTo.clientWidth}px`;
	}

	return {
		style: flyoutStyles,
		className: cx(
			Theme.flyout,
			Theme[primaryAxis],
			alignmentClasses.map(a => Theme[a]),
			states.map(s => StatesToClass[s] ?? Theme[s])
		),
		...otherProps,
	};
}
