/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import { getTracked, isTracked, useTracked } from '../KeyTracker';

class Store {}

describe('KeyTracker', () => {
	describe('getTracked', () => {
		test('no key returns a new store', () => {
			const first = getTracked(Store);
			const second = getTracked(Store);

			expect(first.tracked).not.toBe(second.tracked);

			first.free();
			second.free();
		});

		test('same key returns the same instance', () => {
			const first = getTracked(Store, 'key');
			const second = getTracked(Store, 'key');

			expect(first.tracked).toBe(second.tracked);

			first.free();
			second.free();
		});

		test('same key returns a new instance after all previous tracked-s have been freed', () => {
			const first = getTracked(Store, 'freed');
			const second = getTracked(Store, 'freed');

			first.free();
			second.free();

			const third = getTracked(Store, 'freed');

			expect(getTracked(Store, 'freed').tracked).not.toBe(first.tracked);

			third.free();
		});
	});

	describe('isTracked', () => {
		test('truthy for store/key combos that are tracked', () => {
			const first = getTracked(Store, 'is-tracked');

			expect(isTracked(Store, 'is-tracked')).toBeTruthy();

			first.free();
		});

		test('falsy for store/key combos that are not tracked', () => {
			expect(isTracked(Store, 'not-tracked')).toBeFalsy();
		});
	});

	describe('useTracked', () => {
		test('returns instance of Store', () => {
			const { result } = renderHook(() => useTracked(Store));

			expect(result.current).toBeInstanceOf(Store);
		});

		test('a new key returns a new instance', () => {
			const { result, rerender } = renderHook(
				({ key }) => useTracked(Store, key),
				{
					initialProps: { key: 'initial-key' },
				}
			);

			const initial = result.current;

			rerender({ key: 'updated-key' });

			expect(result.current).not.toBe(initial);

			expect(isTracked(Store, 'initial-key')).toBeFalsy();
		});
	});
});
