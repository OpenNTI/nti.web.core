import cx from 'classnames';

import { getBorderProps } from '../../../system/css/get-border-props';
import { getSpacingProps } from '../../../system/css/get-spacing-props';
import { getTypographyProps } from '../../../system/css/get-typography-props';
import { VariantGetter, PropMapper } from '../../../system/utils/PropGetters';

import Theme from './Input.theme.css';

const getStyleProps = PropMapper({
	inputStyle: VariantGetter(['box'], 'box'),

	size: VariantGetter(['medium'], 'medium'),
	length: VariantGetter(['medium']),
});

const StyleToDefaultBorderProps = {
	box: { rounded: 'xsmall' },
};

const SizeToDefaultSpacingProps = {
	medium: {
		pv: 'sm',
		ph: 'sm',
	},
};

const SizeToDefaultTypeProps = {
	medium: {
		type: 'body',
	},
};

export function getInputStyleProps(props) {
	const { className, inputStyle, size, ...otherProps } = getStyleProps(props);

	const inputProps = {
		...otherProps,
		className: cx(
			className,
			'nti-input',
			Theme.input,
			Theme[inputStyle],
			Theme[size]
		),
	};

	return getBorderProps(
		getTypographyProps(
			getSpacingProps(inputProps, SizeToDefaultSpacingProps[size]),
			SizeToDefaultTypeProps[size]
		),
		StyleToDefaultBorderProps[inputStyle]
	);
}

export function getPlaceholderStyleProps({ className, ...otherProps }) {
	return {
		className: cx(className, Theme.placeholder),
		...otherProps,
	};
}
