/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import { useRead } from '../use-read';
import Context from '../../Context';

function MockStores(stores) {
	return stores.map((s, i) => ({
		index: i,
		id: s.id,
		read: () => s,
	}));
}

function MockContext(stores) {
	return ({ children }) =>
		stores
			.slice()
			.reverse()
			.reduce(
				(acc, store) => <Context store={store}>{acc}</Context>,
				children
			);
}

describe('useRead', () => {
	describe('Contextual', () => {
		test('no predicate returns read of closest store in context', () => {
			const stores = [{ id: 1 }, { id: 2 }, { id: 3 }];

			const { result } = renderHook(() => useRead(), {
				wrapper: MockContext(MockStores(stores)),
			});

			expect(result.current).toBe(stores[stores.length - 1]);
		});

		test('returns read of closest store that matches the predicate', () => {
			const stores = [{ id: 1 }, { id: 2 }, { id: 1 }];

			const { result } = renderHook(() => useRead(s => s.id === 1), {
				wrapper: MockContext(MockStores(stores)),
			});

			expect(result.current).toBe(stores[stores.length - 1]);
		});

		test('returns undefined if no stores match', () => {
			const stores = [{ id: 1 }, { id: 2 }, { id: 3 }];

			const { result } = renderHook(() => useRead(() => false), {
				wrapper: MockContext(MockStores(stores)),
			});

			expect(result.current).toBeUndefined();
		});
	});

	describe('Direct', () => {
		test('uses the read on the predicate if defined', () => {
			const store = {};
			const predicate = { read: () => store };

			const { result } = renderHook(() => useRead(predicate));

			expect(result.current).toBe(store);
		});
	});
});
