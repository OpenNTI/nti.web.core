import React from 'react';

import combineProps from '../../system/utils/combine-props';

export default function Variant(Component, variantProps, name) {
	const cmp = React.forwardRef((props, ref) => {
		const combinedProps =
			typeof variantProps === 'function'
				? variantProps(props)
				: combineProps(variantProps, props);

		return <Component {...combinedProps} ref={ref} />;
	});

	cmp.displayName = `${Component.displayName ?? Component.name ?? ''}${
		name || 'Variant'
	}`;

	return cmp;
}
