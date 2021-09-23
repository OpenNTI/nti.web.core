import React from 'react';

import { HOC } from '@nti/lib-commons';

import combineProps from '../../system/utils/combine-props';

export function Variant(Component, variantProps, name) {
	const cmp = React.forwardRef((props, ref) => {
		const combinedProps =
			typeof variantProps === 'function'
				? variantProps(props)
				: combineProps(variantProps, props);

		return <Component {...combinedProps} ref={ref} />;
	});

	HOC.hoistStatics(
		cmp,
		Component,
		`${Component.displayName ?? Component.name ?? ''}${name || 'Variant'}`
	);

	return cmp;
}
