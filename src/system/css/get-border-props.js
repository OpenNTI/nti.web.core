/** @typedef {boolean} RoundedValue */
/**
 * @typedef {object} BorderProps
 * @property {RoundedValue=} rounded
 */

import cx from 'classnames';

import Styles from './rules/border.module.css';

const RoundingProps = {
	rounded: {
		[true]: Styles.roundedSmall,
	},
};

function getRoundingProps(props) {
	for (let [prop, values] of Object.entries(RoundingProps)) {
		if (!props[prop] || !values[props[prop]]) {
			continue;
		}

		const value = values[props[prop]];

		delete props[prop];

		return [value, props];
	}

	return [null, props];
}

/**
 * Get the props necessary to apply the given border styling
 *
 * @param {BorderProps} propsArg
 * @param {BorderProps} defaultProps
 * @returns {{className: string}}
 */
export function getBorderProps(propsArg, defaultProps = {}) {
	const { className, ...props } = propsArg;

	const providedRoundingProps = getRoundingProps(props);
	const wasProvidedRoundingProps = Boolean(providedRoundingProps[0]);

	const roundingProps = wasProvidedRoundingProps
		? providedRoundingProps
		: getRoundingProps(defaultProps);

	const roundingClassName = roundingProps[0];
	const restProps = wasProvidedRoundingProps
		? providedRoundingProps[1]
		: props;

	return { className: cx(roundingClassName, className), ...restProps };
}
