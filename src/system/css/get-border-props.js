/** @typedef {boolean} RoundedValue */
/**
 * @typedef {object} BorderProps
 * @property {RoundedValue=} rounded
 */

import cx from 'classnames';

import Styles from './rules/border.module.css';

const RoundingProps = {
	rounded: {
		[true]: 'roundedSmall',
	},
};

const ElevationProps = {
	elevated: {
		[true]: 'elevation-one',
	},
};

function getPropsFromMap(props, map) {
	for (let [prop, values] of Object.entries(map)) {
		if (!props[prop] || !values[props[prop]]) {
			continue;
		}

		const value = values[props[prop]];

		delete props[prop];

		return [value, props];
	}

	return [null, props];
}

const getRoundingVariant = props => getPropsFromMap(props, RoundingProps);
const getElevationVariant = props => getPropsFromMap(props, ElevationProps);

function getVariantOrDefault(getter, props, defaults) {
	const provided = getter(props);

	if (provided[0]) {
		return provided;
	}

	const [defaultProp] = getter(defaults);

	return [defaultProp, props];
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

	const [rounding, restRoundingProps] = getVariantOrDefault(
		getRoundingVariant,
		props,
		defaultProps
	);
	const [elevation, restElevationProps] = getVariantOrDefault(
		getElevationVariant,
		restRoundingProps,
		defaultProps
	);

	return {
		className: cx(className, Styles[rounding], Styles[elevation]),
		...restElevationProps,
	};
}
