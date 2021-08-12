import React, { useState } from 'react';
import cx from 'classnames';

import { VariantGetter } from '../../../system/utils/PropGetters';
import { useOnScreen } from '../../hooks/use-on-screen';
import Theme from '../Placeholder.theme.css';

const getStyleVariant = VariantGetter(['flat', 'shimmer'], 'shimmer');

export function Base({ className, as: Cmp = 'div', ...props }) {
	const [onScreen, setOnScreen] = useState(false);

	const [style, otherProps] = getStyleVariant(props);

	return (
		<Cmp
			className={cx(className, Theme.placeholder, Theme[style], {
				[Theme.onScreen]: onScreen,
			})}
			{...useOnScreen(setOnScreen)}
			{...otherProps}
		/>
	);
}
