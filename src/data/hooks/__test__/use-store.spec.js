/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import useStore from '../use-store';

class Store {
	static create() {
		const Cls = this;
		return new Cls();
	}
}

describe('useStore', () => {
	describe('return value', () => {
		test('returns correct store', () => {
			const store = {};

			const { result } = renderHook(() =>
				useStore({ create: () => store })
			);

			expect(result.current).toBe(store);
		});

		test('same key returns the same store instance', () => {
			const { result: first } = renderHook(() =>
				useStore(Store, { key: 'same' })
			);
			const { result: second } = renderHook(() =>
				useStore(Store, { key: 'same' })
			);

			expect(first.current).toBe(second.current);
		});

		test('new key returns a new store instance', () => {
			const { result, rerender } = renderHook(
				({ key }) => useStore(Store, { key }),
				{ initialProps: { key: 'first' } }
			);

			const first = result.current;

			rerender({ key: 'second' });

			expect(result.current).not.toBe(first);
		});
	});

	describe('Lifecycle', () => {
		function getTest() {
			const initial = jest.fn();
			const unload = jest.fn();

			class Test extends Store {
				initialLoad() {
					initial();
				}

				unload() {
					unload();
				}
			}

			return { Test, initial, unload };
		}

		test('calls initialLoad', () => {
			const { Test, initial } = getTest();

			renderHook(() => useStore(Test));

			expect(initial).toHaveBeenCalled();
		});

		test('does not call initialLoad if the params change', () => {
			const { Test, initial } = getTest();

			const { rerender } = renderHook(
				(params = {}) => useStore(Test, params),
				{
					initialProps: { param: 'bar' },
				}
			);

			rerender({ param: 'foo' });

			expect(initial).toHaveBeenCalledTimes(1);
		});

		test('unmount triggers unload', () => {
			const { Test } = getTest();

			const { result, unmount } = renderHook(() => useStore(Test));

			const store = result.current;
			jest.spyOn(store, 'unload');

			unmount();

			expect(store.unload).toHaveBeenCalled();
		});

		test('a new key triggers initialLoad', () => {
			const { Test, initial } = getTest();

			const { rerender } = renderHook(params => useStore(Test, params), {
				initialProps: { key: 'first' },
			});

			rerender({ key: 'second' });

			expect(initial).toHaveBeenCalledTimes(2);
		});

		test('a new key triggers unload of previous store', () => {
			const { Test } = getTest();

			const { result, rerender } = renderHook(
				params => useStore(Test, params),
				{ initialProps: { key: 'first' } }
			);

			const first = result.current;

			jest.spyOn(first, 'unload');

			rerender({ key: 'second' });

			expect(first.unload).toHaveBeenCalled();
		});
	});

	describe('Parameters', () => {
		function buildTest() {
			const setParams = jest.fn();
			const initialLoad = jest.fn();

			class Test extends Store {
				setParams(...args) {
					this.firstCall = this.firstCall ?? 'setParams';
					setParams(...args);
				}

				initialLoad(...args) {
					this.firstCall = this.firstCall ?? 'initialLoad';
					initialLoad(...args);
				}
			}

			return { Test, setParams, initialLoad };
		}

		test('calls setParams with initial params', () => {
			const { Test, setParams } = buildTest();

			renderHook(() => useStore(Test, { foo: 'bar' }));

			expect(setParams).toHaveBeenCalledWith({ foo: 'bar' });
		});

		test('calls setParams before initialLoad', () => {
			const { Test, initialLoad, setParams } = buildTest();

			const { result } = renderHook(() => useStore(Test, { foo: 'bar' }));

			expect(result.current.firstCall).toEqual('setParams');
			expect(initialLoad).toHaveBeenCalled();
			expect(setParams).toHaveBeenCalled();
		});

		test('calls setParams when the params update', () => {
			const { Test } = buildTest();

			const { result, rerender } = renderHook(
				params => useStore(Test, params),
				{
					initialProps: { foo: 'bar' },
				}
			);

			const first = result.current;
			jest.spyOn(first, 'setParams');

			rerender({ foo: 'baz' });

			expect(first.setParams).toHaveBeenCalledWith({ foo: 'baz' });
		});

		test('does not pass key as a param', () => {
			const { Test, setParams } = buildTest();

			renderHook(() => useStore(Test, { key: 'key', foo: 'bar' }));

			expect(setParams).toHaveBeenCalledWith({ foo: 'bar' });
		});
	});
});
