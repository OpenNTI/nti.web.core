import cx from 'classnames';

import { VariantGetter } from '../utils/PropGetters';

import Styles from './rules/typography.module.css';

const getTypographyVariant = VariantGetter(
	['header-one', 'body'],
	null,
	'typography'
);

export function getTypographyProps(propsArg, defaults) {
	const { className, ...props } = propsArg;

	const providedTypeProps = getTypographyVariant(props);
	const wasProvidedTypeProps = Boolean(providedTypeProps[0]);

	const typeProps = wasProvidedTypeProps
		? providedTypeProps
		: getTypographyVariant(defaults);

	const typeClassName = Styles[typeProps[0]];
	const restProps = wasProvidedTypeProps ? providedTypeProps[1] : props;

	return { className: cx(typeClassName, className), ...restProps };
}
