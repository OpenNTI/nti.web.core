import React from 'react';

import { rawContent, getRefHandler } from '@nti/lib-commons';

import Variant from '../HighOrderComponents/Variant';

import useTransforms from './transforms/use-transforms';

const Text = React.forwardRef((props, ref) => {
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
});

Text.displayName = 'NTIText';

Text.Translator = getString => Variant(Text, { getString }, 'translator');

export default Text;
