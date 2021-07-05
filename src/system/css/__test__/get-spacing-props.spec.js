/* eslint-env jest */
import { getSpacingProps } from '../get-spacing-props.js';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const sides = ['t', 'r', 'b', 'l', 'h', 'v'];

// convenience: turns names into boolean props,
// e.g. 'foo' => { foo: true }
// or ['foo', 'bar'] => { foo: true, bar: true }
const b = keys =>
	[keys].flat().reduce((acc, prop) => ({ ...acc, [prop]: true }), {});

describe('get spacing props', () => {
	test('boolean padding props map to classnames ', () => {
		sizes.forEach(size => {
			// p-md => p-md, etc.
			expect(getSpacingProps(b(`p-${size}`)).className).toBe(`p-${size}`);

			sides.forEach(side =>
				// pv-md => pv-md, etc.
				expect(getSpacingProps(b(`p${side}-${size}`)).className).toBe(
					`p${side}-${size}`
				)
			);
		});
	});

	test('boolean margin props map to classnames', () => {
		sizes.forEach(size => {
			// m-sm => m-sm, etc.
			expect(getSpacingProps(b(`m-${size}`)).className).toBe(`m-${size}`);

			sides.forEach(side =>
				// mv-sm => mv-sm, etc.
				expect(getSpacingProps(b(`m${side}-${size}`)).className).toBe(
					`m${side}-${size}`
				)
			);
		});
	});

	test('multple boolean props map to multple classnames', () => {
		const { className } = getSpacingProps(b(['p-md', 'mh-lg']));
		const names = className.split(' ');
		expect(names).toHaveLength(2);
		expect(names[0]).toBe('p-md');
		expect(names[1]).toBe('mh-lg');
	});

	test('string padding props map to classnames', () => {
		sizes.forEach(size => {
			// { p: 'md' } => { className: 'p-md' }
			expect(getSpacingProps({ p: size })).toHaveProperty(
				'className',
				`p-${size}`
			);

			sides.forEach(side => {
				// { pv: 'xl' } => { className: 'pv-xl' }
				expect(getSpacingProps({ [`p${side}`]: size })).toHaveProperty(
					'className',
					`p${side}-${size}`
				);
			});
		});
	});

	test('string margin props map to classnames', () => {
		sizes.forEach(size => {
			// { m: 'md' } => { className: 'm-md' }
			expect(getSpacingProps({ m: size })).toHaveProperty(
				'className',
				`m-${size}`
			);

			sides.forEach(side => {
				// { pv: 'xl' } => { className: 'pv-xl' }
				expect(getSpacingProps({ [`m${side}`]: size })).toHaveProperty(
					'className',
					`m${side}-${size}`
				);
			});
		});
	});
});
