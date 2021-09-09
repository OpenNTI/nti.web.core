import React from 'react';

import { rawContent, getRefHandler } from '@nti/lib-commons';

import Variant from '../high-order/Variant';
import { getTypographyProps } from '../../system/css/get-typography-props';
import { getSpacingProps } from '../../system/css/get-spacing-props';

import useTransforms from './transforms/use-transforms';

const TextImpl = (props, ref) => {
	const [transformedRef, transformedProps] = useTransforms(props);
	const {
		as: Cmp = 'span',
		allowMarkup,
		text,
		...otherProps
	} = transformedProps;

	const contentProps = allowMarkup ? rawContent(text) : { children: text };

	return (
		<Cmp
			ref={getRefHandler(ref, transformedRef)}
			{...otherProps}
			{...contentProps}
		/>
	);
};

export const Text = React.forwardRef(TextImpl);

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
