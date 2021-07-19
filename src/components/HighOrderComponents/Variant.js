import React from 'react';
import cx from 'classnames';

function combineProps(a = {}, b = {}) {
	const combined = { ...a, ...b };

	if (a.className != null && b.className != null) {
		combined.className = cx(a.className, b.className);
	}

	if (a.style != null && b.style != null) {
		combined.style = { ...a.style, ...b.style };
	}

	return combined;
}

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
