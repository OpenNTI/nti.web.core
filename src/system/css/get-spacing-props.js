import p from './rules/padding.module.css';
import m from './rules/margin.module.css';

const mapping = {
	p,
	m,
};

function classFromPropName(propName) {
	const type = propName.charAt(0);
	return mapping[type]?.[propName];
}

export function classFromProp(name, value) {
	// { 'p-md': true } via <Cmp p-md />
	if (value === true) {
		return classFromPropName(name);
	}

	// { p: 'md' } via <Cmp p="md" />
	const type = name.charAt(0);
	const key = `${name}-${value}`; // 'p-md'
	return mapping[type]?.[key];
}

export function getSpacingProps(props, defaults) {
	const className = Object.entries({ ...defaults, ...props })
		.map(([prop, value]) => classFromProp(prop, value))
		.filter(Boolean)
		.join(' ');

	return { className };
}
