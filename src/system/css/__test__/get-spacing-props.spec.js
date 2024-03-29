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

	test('multiple boolean props map to multiple classnames', () => {
		const { className } = getSpacingProps(b(['p-md', 'mh-lg']));
		const names = className.split(' ');

		expect(names).toEqual(['mh-lg', 'p-md']);
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

	test('defaults support', () => {
		const props = { m: 'lg', p: 'lg' };
		const defaults = { m: 'xl', p: 'xl' };

		// props should override defaults
		expect(getSpacingProps(props, defaults)).toHaveProperty(
			'className',
			'm-lg p-lg'
		);

		// defaults show up when no corresponding prop is provided
		delete props.m;
		expect(getSpacingProps(props, defaults)).toHaveProperty(
			'className',
			'm-xl p-lg'
		);

		// defaults first, then props
		props.mv = 'sm';
		expect(getSpacingProps(props, defaults)).toHaveProperty(
			'className',
			'mv-sm mh-xl p-lg'
		);
	});
});
