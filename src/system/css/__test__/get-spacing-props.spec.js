/* eslint-env jest */
import { getSpacingProps } from '../get-spacing-props.js';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const sides = ['l', 't', 'r', 'b', 'h', 'v'];

// turns names into boolean props,
// e.g. 'foo' => { foo: true }
// or ['foo', 'bar'] => { foo: true, bar: true }
const k = keys =>
	[keys].flat().reduce((acc, prop) => ({ ...acc, [prop]: true }), {});

describe('get spacing props', () => {
	test('padding props map to classnames ', () => {
		sizes.forEach(size => {
			// p-md => p-md, etc.
			expect(getSpacingProps(k(`p-${size}`)).className).toBe(`p-${size}`);

			sides.forEach(side =>
				// pv-md => pv-md, etc.
				expect(getSpacingProps(k(`p${side}-${size}`)).className).toBe(
					`p${side}-${size}`
				)
			);
		});
	});

	test('margin props map to classnames', () => {
		sizes.forEach(size => {
			// m-sm => m-sm, etc.
			expect(getSpacingProps(k(`m-${size}`)).className).toBe(`m-${size}`);

			sides.forEach(side =>
				// mv-sm => mv-sm, etc.
				expect(getSpacingProps(k(`m${side}-${size}`)).className).toBe(
					`m${side}-${size}`
				)
			);
		});
	});

	test('multple props map to multple classnames', () => {
		const { className } = getSpacingProps(k(['p-md', 'mh-lg']));
		const names = className.split(' ');
		expect(names).toHaveLength(2);
		expect(names[0]).toBe('p-md');
		expect(names[1]).toBe('mh-lg');
	});
});
