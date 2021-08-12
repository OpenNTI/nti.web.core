import React, { useMemo } from 'react';

export function generator(placeholder) {
	return ({ as: typeReplacement, ...otherProps }) => {
		if (typeReplacement && !typeReplacement.withComponent) {
			otherProps.as = typeReplacement;
		}

		const Type = useMemo(
			() => typeReplacement?.withComponent?.(placeholder) ?? placeholder,
			[typeReplacement]
		);

		return <Type {...otherProps} />;
	};
}
