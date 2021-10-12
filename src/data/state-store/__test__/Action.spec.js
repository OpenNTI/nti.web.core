/* eslint-env jest */
import Action from '../Action';

import { pump, swallow, MockAction } from './utils';

//TODO: test superseded and concurrent actions

describe('DataStore Action Tests', () => {
	test('isAction check', () => {
		expect(Action.isAction(Action(() => {}))).toBeTruthy();
		expect(Action.isAction(() => {})).toBeFalsy();
	});

	test('passes args to implementation', async () => {
		const method = jest.fn();
		const action = Action(method).bindStore({});

		await action(1, 2, 3);
		expect(method).toHaveBeenCalledWith(expect.any(Object), 1, 2, 3);
	});

	describe('Properties', () => {
		const store = {};

		describe('hasRun', () => {
			test('not truthy before its a run has finished', async () => {
				const { method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(action.hasRun).toBeFalsy();

				action();
				expect(action.hasRun).toBeFalsy();
			});

			test('truthy after a successful run', async () => {
				const { method, fulfill } = MockAction();

				const action = Action(method).bindStore(store);

				expect(action.hasRun).toBeFalsy();

				fulfill(0);
				await action();

				expect(action.hasRun).toBeTruthy();
			});

			test('truthy after a failed run', async () => {
				const { method, reject } = MockAction();

				const action = Action(method).bindStore(store);

				expect(action.hasRun).toBeFalsy();

				await reject(0);
				await action();

				expect(action.hasRun).toBeTruthy();
			});
		});

		describe('running', () => {
			test('falsy if not called yet', () => {
				const { method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(action.running).toBeFalsy();
			});

			test('truthy if there is a pending action', async () => {
				const { method, fulfill } = MockAction();

				const action = Action(method).bindStore(store);

				const first = action();
				action();

				expect(action.running).toBeTruthy();

				await fulfill(0);
				await first;

				expect(action.running).toBeTruthy();
			});

			test('falsy if all calls have resolved (successfully or not)', async () => {
				const { method, fulfill, reject } = MockAction();
				const action = Action(method).bindStore(store);

				const first = action();
				const second = action();

				await fulfill(0);
				await reject(1);
				await first;
				await second;

				expect(action.running).toBeFalsy();
			});
		});

		describe('error', () => {
			test('null before a run has finished', () => {
				const { method } = MockAction();
				const action = Action(method).bindStore(store);

				expect(action.error).toBeNull();
			});

			test('null if all runs have been successful', async () => {
				const { method, fulfill } = MockAction();
				const action = Action(method).bindStore(store);

				const first = action();
				const second = action();

				await fulfill(0);
				await fulfill(1);
				await first;
				await second;

				expect(action.error).toBeNull();
			});

			test('Equals the error of a failed run', async () => {
				const { method, reject } = MockAction();
				const action = Action(method).bindStore(store);

				const error = new Error(test);

				const first = action();

				await reject(0, error);
				await swallow(first);

				expect(action.error).toEqual(error);
			});

			test('null if a successful run happens after a failed one', async () => {
				const { method, reject, fulfill } = MockAction();
				const action = Action(method).bindStore(store);

				const first = action();
				const second = action();

				await reject(0, 'error');
				await fulfill(1);
				await first;
				await second;

				expect(action.error).toBeNull();
			});
		});
	});

	describe('Store Binding', () => {
		describe('onStart', () => {
			test('gets called on subsequent runs', async () => {
				const store = { onStart: jest.fn() };
				const { fulfill, reject, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onStart).not.toHaveBeenCalled();
				action();
				fulfill(0);
				action();
				reject(1);
				action();

				expect(store.onStart).toHaveBeenCalledTimes(3);
			});

			test('gets called for overlapping runs', () => {
				const store = { onStart: jest.fn() };
				const { method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onStart).not.toHaveBeenCalled();
				action();
				action();
				action();

				expect(store.onStart).toHaveBeenCalledTimes(3);
			});
		});

		describe('onFinish', () => {
			test('gets called after actions finishes', async () => {
				const store = { onFinish: jest.fn() };
				const { fulfill, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onFinish).not.toHaveBeenCalled();

				action();

				expect(store.onFinish).not.toHaveBeenCalled();

				await fulfill(0);

				expect(store.onFinish).toHaveBeenCalledTimes(1);

				action();

				expect(store.onFinish).toHaveBeenCalledTimes(1);

				await fulfill(1);

				expect(store.onFinish).toHaveBeenCalledTimes(2);
			});

			test('does not get called twice if another run interrupts', async () => {
				const store = { onFinish: jest.fn() };
				const { fulfill, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onFinish).not.toHaveBeenCalled();

				action();
				action();
				await fulfill(0);
				await fulfill(1);

				expect(store.onFinish).toHaveBeenCalledTimes(1);
			});

			test('does not get called if the run fails', async () => {
				const store = { onFinish: jest.fn() };
				const { reject, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onFinish).not.toHaveBeenCalled();

				action();

				expect(store.onFinish).not.toHaveBeenCalled();

				await reject(0);

				expect(store.onFinish).not.toHaveBeenCalled();
			});
		});

		describe('onError', () => {
			test('gets called after actions fails', async () => {
				const store = { onError: jest.fn() };
				const { reject, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onError).not.toHaveBeenCalled();

				action();

				expect(store.onError).not.toHaveBeenCalled();

				await reject(0);

				expect(store.onError).toHaveBeenCalledTimes(1);

				action();

				expect(store.onError).toHaveBeenCalledTimes(1);

				await reject(1);

				expect(store.onError).toHaveBeenCalledTimes(2);
			});

			test('does not get called twice if another run interrupts', async () => {
				const store = { onError: jest.fn() };
				const { reject, fulfill, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onError).not.toHaveBeenCalled();

				action();
				action();
				await fulfill(0);
				await reject(1);

				expect(store.onError).toHaveBeenCalledTimes(1);
			});

			test('does not get called if the run succeeds', async () => {
				const store = { onError: jest.fn() };
				const { fulfill, method } = MockAction();

				const action = Action(method).bindStore(store);

				expect(store.onError).not.toHaveBeenCalled();

				action();

				expect(store.onError).not.toHaveBeenCalled();

				await fulfill(0);

				expect(store.onError).not.toHaveBeenCalled();
			});
		});

		describe('onUpdate', () => {
			test('pushes update to store binding', () => {
				const store = { onUpdate: jest.fn() };
				const { method, update } = MockAction();

				const action = Action(method).bindStore(store);

				action();

				update(0, 'update');

				expect(store.onUpdate).toHaveBeenCalledTimes(1);
				expect(store.onUpdate).toHaveBeenCalledWith('update');
			});
		});
	});
});
