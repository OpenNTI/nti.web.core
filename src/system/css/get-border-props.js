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

export function getBorderProps(propsArg, defaultProps = {}) {
	const { className, ...props } = propsArg;

	const providedRoundingProps = getRoundingProps(props);
	const wasProvidedRoundingProps = Boolean(providedRoundingProps);

	const roundingProps =
		providedRoundingProps ?? getRoundingProps(defaultProps);

	const roundingClassName = roundingProps[0];
	const restProps = wasProvidedRoundingProps
		? providedRoundingProps[1]
		: propsArg;

	return { className: cx(roundingClassName, className), ...restProps };
}
