import React from 'react';

export function setOption(fn) {
	fn.isOption = true;
	return fn;
}

export function isOption(fn) {
	return fn === 'option' || fn?.isOption;
}

export function getOptionValue(option) {
	return option.props.value;
}

export function getOptionLabel(option) {
	return option.props.children;
}

export function getOptionLabelsByValue(children) {
	if (!children) {
		return {};
	}

	const kids = React.Children.toArray(children);

	return kids.reduce((acc, kid) => {
		if (kid && isOption(kid.type)) {
			return { ...acc, [getOptionValue(kid)]: getOptionLabel(kid) };
		}

		return { ...acc, ...getOptionLabelsByValue(kid?.props?.children) };
	}, {});
}
