/* eslint-env jest */

import { VariantGetter, StateGetter } from '../PropGetters';

describe('PropGetters', () => {
	describe('VariantGetter', () => {
		describe('explicit', () => {
			const getVar = VariantGetter(
				['variant1', 'variant2', 'variant3'],
				'variant1'
			);

			test('variant in explicit prop, returns variant and consumes the explicit prop', () =>
				expect(getVar({ variant: 'variant2', foo: 'bar' })).toEqual([
					'variant2',
					{ foo: 'bar' },
				]));

			test('non-variant in explicit prop, returns default and does not consume the explicit prop', () =>
				expect(getVar({ variant: 'non-variant', foo: 'bar' })).toEqual([
					'variant1',
					{ variant: 'non-variant', foo: 'bar' },
				]));
		});

		describe('boolean', () => {
			const getVar = VariantGetter(
				['variant1', 'variant2', 'variant3'],
				'variant1'
			);

			test('returns any variant in the list, and consumes the prop', () => (
				expect(getVar({ variant1: true, foo: 'bar' })).toEqual([
					'variant1',
					{ foo: 'bar' },
				]),
				expect(getVar({ variant2: true, foo: 'bar' })).toEqual([
					'variant2',
					{ foo: 'bar' },
				]),
				expect(getVar({ variant3: true, foo: 'bar' })).toEqual([
					'variant3',
					{ foo: 'bar' },
				])
			));

			test('prefers variants in order if multiple are set', () =>
				expect(getVar({ variant2: true, variant3: true })).toEqual([
					'variant2',
					{ variant3: true },
				]));
		});
	});

	describe('StateGetter', () => {
		const getState = StateGetter(
			['state1', 'state2', 'state3'],
			['state1']
		);

		test('gets all state props set to true', () => (
			expect(
				getState({
					state1: true,
					state2: true,
					state3: true,
					foo: 'bar',
				})
			).toEqual([['state1', 'state2', 'state3'], { foo: 'bar' }]),
			expect(
				getState({ state1: true, state2: false, foo: 'bar' })
			).toEqual([['state1'], { foo: 'bar' }])
		));

		test('returns default state is no state props set', () =>
			expect(getState({ foo: 'bar' })).toEqual([
				['state1'],
				{ foo: 'bar' },
			]));
	});
});
