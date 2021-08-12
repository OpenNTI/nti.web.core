import React, { useMemo } from 'react';

export function generator(placeholder) {
	return ({ as: typeReplacement, ...otherProps }) => {
		if (typeReplacement && !typeReplacement.withComponent) {
			throw new Error(
				'Invalid "as" prop given to placeholder. Must be a styled component.'
			);
		}

		const Type = useMemo(
			() => typeReplacement?.withComponent?.(placeholder) ?? placeholder,
			[typeReplacement]
		);

		return <Type {...otherProps} />;
	};
}
