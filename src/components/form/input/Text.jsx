import React, { useMemo } from 'react';

import { getInputStyleProps } from './get-input-props';

function TextImpl({ onChange: onChangeProp, ...otherProps }, ref) {
	const onChange = useMemo(
		() => onChangeProp && (e => onChangeProp(e.target.value, e)),
		[onChangeProp]
	);

	return (
		<input
			ref={ref}
			type="text"
			onChange={onChange}
			{...getInputStyleProps(otherProps)}
		/>
	);
}

export const Text = React.forwardRef(TextImpl);
