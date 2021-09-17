import React from 'react';

const PrimitivesTypes = {
	string: true,
	number: true,
};

function getTranslatedContent(localeKey, getString, data) {
	const { translateData, parts } = Object.entries(data ?? {}).reduce(
		(acc, entry) => {
			const [key, value] = entry;
			const type = typeof value;

			if (PrimitivesTypes[type]) {
				acc.translateData[key] = value;
			} else {
				acc.translateData[key] = `***${key}***`;
				acc.parts[key] = value;
			}

			return acc;
		},
		{ translateData: {}, parts: {} }
	);

	const translation = getString(localeKey, translateData);
	const translationParts = translation.split('***');

	if (translationParts.length === 1) {
		return { text: translation, allowMarkup: true };
	}

	const text = (
		<>
			{translationParts.map((part, index) => {
				if (index % 2 === 0) {
					return <span key={index}>{part}</span>;
				}

				const cmp = parts[part];

				return React.cloneElement(cmp, { key: index });
			})}
		</>
	);

	return { text, allowMarkup: true };
}

export default function useTranslate(
	ref,
	{ localeKey, getString, with: data, text, ...otherProps }
) {
	const isTranslated = getString && localeKey;

	if (!isTranslated) {
		return { text, ...otherProps };
	}

	return {
		...otherProps,
		...getTranslatedContent(localeKey, getString, data),
	};
}
