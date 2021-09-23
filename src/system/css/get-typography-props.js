import cx from 'classnames';

import { VariantGetter } from '../utils/PropGetters';

import styles from './rules/typography.module.css';

const getTypographyVariant = VariantGetter(
	['header-one', 'header-one-alt', 'subhead-one', 'body'],
	null,
	'type'
);

const getColorVariant = VariantGetter(
	['light', 'dark', 'regular', 'error'],
	'regular',
	'color'
);

const getAlignVariant = VariantGetter(
	['left', 'center', 'right'],
	null,
	'align'
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
	const [alignClass, restAlignProps] = getVariantOrDefault(
		getAlignVariant,
		restColorProps,
		defaults
	);

	return {
		className: cx(
			className,
			(typeClass || colorClass) && styles.typography,
			styles[typeClass],
			styles[colorClass],
			styles[alignClass]
		),
		...restAlignProps,
	};
}
