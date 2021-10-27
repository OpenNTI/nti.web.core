import React from 'react';

import { Text } from '../Text';

import { escape } from './utils';

const PrimitivesTypes = {
	string: true,
	number: true,
};

function getTranslatedContent(localeKey, getString, data) {
	const { translateData, parts } = Object.entries(data ?? {}).reduce(
		(acc, entry) => {
			const [key, value] = entry;
			const type = typeof value;

			if (PrimitivesTypes[type] || value == null) {
				acc.translateData[key] = value ?? '';
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
		return { text: escape(translation), isMarkup: true };
	}

	const text = (
		<>
			{translationParts.map((part, index) => {
				if (index % 2 === 0) {
					// Recursive: Let Text handle each part
					return <Text key={index}>{part}</Text>;
				}

				const [key, txt = key] = part.split('|');
				const cmp = parts[key];

				return React.cloneElement(cmp, { key: part, text: txt });
			})}
		</>
	);

	return { text, isMarkup: false };
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
