import p from './rules/padding.module.css';
import m from './rules/margin.module.css';

const mapping = {
	p,
	m,
};

export function getSpacingProps(props, defaults) {
	const className = Object.keys(props)
		.map(prop => {
			const type = prop.charAt(0);
			return mapping[type]?.[prop];
		})
		.filter(Boolean)
		.join(' ');

	return { className };
}
