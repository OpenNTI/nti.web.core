import cx from 'classnames';

import { VariantGetter } from '../utils/PropGetters';

import Styles from './rules/typography.module.css';

const getTypographyVariant = VariantGetter(
	['header-one', 'body'],
	null,
	'typography'
);

const getColorVariant = VariantGetter(
	['light', 'dark', 'regular'],
	'regular',
	'color'
);

function getVariantOrDefault(getter, props, defaults) {
	const provided = getter(props);

	if (provided[0]) {
		return provided;
	}

	const [defaultProp] = getter(defaults);

	return [defaultProp, props];
}

export function getTypographyProps(propsArg, defaults) {
	const { className, ...props } = propsArg;

	const [typeClass, restTypeProps] = getVariantOrDefault(
		getTypographyVariant,
		props,
		defaults
	);
	const [colorClass, restColorProps] = getVariantOrDefault(
		getColorVariant,
		restTypeProps,
		defaults
	);

	return {
		className: cx(
			className,
			(typeClass || colorClass) && Styles.typography,
			Styles[typeClass],
			Styles[colorClass]
		),
		...restColorProps,
	};
}
