import React from 'react';

import { rawContent, getRefHandler } from '@nti/lib-commons';

import { Variant } from '../high-order/Variant';
import { getTypographyProps } from '../../system/css/get-typography-props';
import { getSpacingProps } from '../../system/css/get-spacing-props';

import useTransforms from './transforms/use-transforms';

const TextImpl = (props, ref) => {
	const [transformedRef, transformedProps] = useTransforms(props);
	const {
		as: Cmp = 'span',
		isMarkup,
		text,
		...otherProps
	} = transformedProps;

	const contentProps = isMarkup ? rawContent(text) : { children: text };

	return (
		<Cmp
			ref={getRefHandler(ref, transformedRef)}
			{...otherProps}
			{...contentProps}
		/>
	);
};

/** @typedef {(key: string) => string} Translator */
/** @typedef {(getString: Translator) => typeof Text} TranslatorFactory */

/** @type {React.ForwardRefExoticComponent<React.RefAttributes<any>> & {Translator: TranslatorFactory}} */
export const Text = React.forwardRef(TextImpl);

/** @type {React.ForwardRefExoticComponent<React.RefAttributes<any>> & {Translator: TranslatorFactory}} */
export const Typography = React.forwardRef((props, ref) =>
	TextImpl(
		{
			...getSpacingProps(getTypographyProps(props)),
		},
		ref
	)
);

Text.displayName = 'NTIText';

Text.Translator = getString => Variant(Text, { getString }, 'translator');
Typography.Translator = getString =>
	Variant(Typography, { getString }, 'translator');
