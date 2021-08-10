/* eslint-env jest */
import { StateStore as Store } from '../Store';

import { MockAction, pump } from './utils';

function waitForProperty(store, property, value) {
	return new Promise(fulfill => {
		let cleanup = null;

		const maybe = () => {
			const match =
				typeof value === 'function'
					? value(store)
					: store.get(property) === value;

			if (match) {
				fulfill();
				cleanup?.();
			}
		};

		cleanup = store.subscribeToProperties(property, maybe);
		maybe();
	});
}

const waitLoaded = s => waitForProperty(s, 'load', x => x.load.hasRun);

describe('StateStore', () => {
	describe('read', () => {
		test('throws a promise if initialLoad has not been called', () => {
			class Test extends Store {}

			const test = new Test();

			let thrown = null;

			try {
				test.read();
			} catch (e) {
				thrown = e;
			}

			expect(thrown).toBeInstanceOf(Promise);
		});

		test('throws same promise if called multiple times before initialLoad', () => {
			class Test extends Store {}
			const test = new Test();

			const thrown = [];

			try {
				test.read();
			} catch (e) {
				thrown.push(e);
			}

			try {
				test.read();
			} catch (e) {
				thrown.push(e);
			}

			expect(thrown[0]).toBe(thrown[1]);
		});

		test('throws promise if the initialLoad is in flight', () => {
			class Test extends Store {
				load() {
					return new Promise(() => {});
				}
			}

			const test = new Test();

			test.initialLoad();

			let thrown = null;

			try {
				test.read();
			} catch (e) {
				thrown = e;
			}

			expect(thrown).toBeInstanceOf(Promise);
		});

		test('throws the error from load if it threw', async () => {
			const err = new Error('Test');

			class Test extends Store {
				load() {
					throw err;
				}
			}
			const test = new Test();

			test.initialLoad();

			await waitForProperty(test, 'load', s => s.load.hasRun);

			expect(() => test.read()).toThrow(err);
		});

		test('returns store after initial load finishes', async () => {
			class Test extends Store {}
			const test = new Test();

			test.initialLoad();

			await waitForProperty(test, 'load', s => s.load.hasRun);

			expect(test.read()).toBe(test);
		});
	});

	describe('getProperty', () => {
		class Test extends Store {
			storeProperty = 'store';
			shared = 'store';
		}

		test('returns state properties', () => {
			const test = new Test();

			test.updateState({ stateProperty: 'state' });

			expect(test.getProperty('stateProperty')).toEqual('state');
		});

		test('returns store properties', () => {
			const test = new Test();

			expect(test.getProperty('storeProperty')).toEqual('store');
		});

		test('returns params', () => {
			const test = new Test();

			test.setParams({ paramProperty: 'param' });

			expect(test.getProperty('paramProperty')).toEqual('param');
		});

		test('prefers state over store and params', () => {
			const test = new Test();

			test.updateState({ shared: 'state' });
			test.setParams({ shared: 'params' });

			expect(test.getProperty('shared')).toEqual('state');
		});

		test('prefers store over params', () => {
			const test = new Test();

			test.setParams({ shared: 'params' });

			expect(test.getProperty('shared')).toEqual('store');
		});
	});

	describe('initialLoad', () => {
		test('calls load with the current parameters', async () => {
			const load = jest.fn();

			class Test extends Store {
				load(...args) {
					return load(...args);
				}
			}

			const test = new Test();

			test.setParams({ foo: 'bar' });
			test.setParams({ bar: 'foo' });

			test.initialLoad();

			await waitLoaded(test);

			expect(load).toHaveBeenCalledWith({
				prev: null,
				signal: expect.any(AbortSignal),
				params: {
					foo: 'bar',
					bar: 'foo',
				},
				state: {},
			});
		});

		test('only calls load the first time', async () => {
			const load = jest.fn();

			class Test extends Store {
				load(...args) {
					return load(...args);
				}
			}

			const test = new Test();

			test.initialLoad();
			test.initialLoad();

			await waitLoaded(test);

			expect(load).toHaveBeenCalledTimes(1);
		});
	});

	describe('setParams', () => {
		test('does not call load if the initial load has not finished', () => {
			const load = jest.fn();

			class Test extends Store {
				load(...args) {
					return load(...args);
				}
			}

			const test = new Test();
			const params = { foo: 'bar' };

			test.setParams(params);

			expect(load).not.toHaveBeenCalled();
		});

		test('multiple calls in quick succession only trigger one load with combined params', async () => {
			const load = jest.fn();
			const action = MockAction();

			class Test extends Store {
				load(...args) {
					load(...args);
					return action.method(...args);
				}
			}

			const test = new Test();

			await action.fulfill(0);
			test.initialLoad();

			await waitLoaded(test);

			test.setParams({ a: 'a' });
			test.setParams({ b: 'b' });
			test.setParams({ c: 'c' });

			await action.fulfill(1);

			expect(load).toHaveBeenCalledTimes(2);
			expect(load).toHaveBeenCalledWith({
				state: {},
				params: { a: 'a', b: 'b', c: 'c' },
				signal: expect.any(AbortSignal),
				prev: null,
			});
		});

		test.only('aborts inflight load', async () => {
			const load = jest.fn();
			const action = MockAction();

			class Test extends Store {
				load(...args) {
					load(...args);
					return action.method(...args);
				}
			}

			const test = new Test();

			await action.fulfill(0);
			test.initialLoad();

			await waitLoaded(test);

			test.setParams({ foo: 'bar' });
			await waitForProperty(test, 'load', s => s.load.running);

			test.setParams({ bar: 'foo' });
			await pump();

			await action.fulfill(1);
			await action.fulfill(2);

			await waitForProperty(test, 'load', s => !s.load.running);

			expect(load).toHaveBeenCalledTimes(3);
			expect(load.mock.calls[1][0].signal.aborted).toBeTruthy();
		});

		test('does not call load if the store has been unloaded', async () => {
			const load = jest.fn();
			const action = MockAction();

			class Test extends Store {
				load(...args) {
					load(...args);
				}

				unload(...args) {
					return action.method(...args);
				}
			}

			const test = new Test();

			test.initialLoad();
			await waitLoaded(test);

			const unload = test.unload();

			test.setParams({ foo: 'bar' });

			await action.fulfill(0);
			await unload;

			expect(load).toHaveBeenCalledTimes(1);
		});
	});

	describe('load', () => {
		test('pushes updates to the store', async () => {
			class Test extends Store {
				async *load() {
					yield { a: 'a' };
					await pump();
					yield { b: 'b' };
					await pump();
					yield { c: 'c' };
				}
			}

			const test = new Test();

			await test.load();

			expect(test.getProperty('a')).toBe('a');
			expect(test.getProperty('b')).toBe('b');
			expect(test.getProperty('c')).toBe('c');
		});

		test('drives loading', async () => {
			const listener = jest.fn();
			const action = MockAction();
			class Test extends Store {
				load(...args) {
					return action.method(...args);
				}
			}

			const test = new Test();

			test.subscribeToProperties('loading', listener);

			expect(test.loading).toBeFalsy();

			test.load();

			expect(test.loading).toBeTruthy();

			await action.fulfill(0);

			expect(test.loading).toBeFalsy();
			expect(listener).toHaveBeenCalledTimes(2); //when load was called and when it finished
		});

		test('drives loaded', async () => {
			const listener = jest.fn();
			const action = MockAction();
			class Test extends Store {
				load(...args) {
					return action.method(...args);
				}
			}

			const test = new Test();

			test.subscribeToProperties('loaded', listener);

			expect(test.loaded).toBeFalsy();

			test.load();

			expect(test.loaded).toBeFalsy();

			await action.fulfill(0);

			expect(test.loaded).toBeTruthy();
			expect(listener).toHaveBeenCalledTimes(2); //when load was called and when it finished
		});
	});

	describe('unload', () => {
		test('pushes updates to the store', async () => {
			class Test extends Store {
				async *unload() {
					yield { a: 'a' };
					await pump();
					yield { b: 'b' };
					await pump();
					yield { c: 'c' };
				}
			}

			const test = new Test();

			await test.unload();

			expect(test.getProperty('a')).toBe('a');
			expect(test.getProperty('b')).toBe('b');
			expect(test.getProperty('c')).toBe('c');
		});

		test('drives unloading', async () => {
			const listener = jest.fn();
			const action = MockAction();
			class Test extends Store {
				unload(...args) {
					return action.method(...args);
				}
			}

			const test = new Test();

			test.subscribeToProperties('unloading', listener);

			expect(test.unloading).toBeFalsy();

			test.unload();

			expect(test.unloading).toBeTruthy();

			await action.fulfill(0);

			expect(test.unloading).toBeFalsy();
			expect(listener).toHaveBeenCalledTimes(2); //when load was called and when it finished
		});

		test('drives unloaded', async () => {
			const listener = jest.fn();
			const action = MockAction();
			class Test extends Store {
				unload(...args) {
					return action.method(...args);
				}
			}

			const test = new Test();

			test.subscribeToProperties('unloaded', listener);

			expect(test.unloaded).toBeFalsy();

			test.unload();

			expect(test.unloaded).toBeFalsy();

			await action.fulfill(0);

			expect(test.unloaded).toBeTruthy();
			expect(listener).toHaveBeenCalledTimes(2); //when load was called and when it finished
		});
	});
});
