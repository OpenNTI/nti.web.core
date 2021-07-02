/* eslint-env jest */
import Action from '../Action';

function pump() {
	return new Promise(fulfill => {
		setTimeout(() => fulfill(), 1);
	});
}

async function swallow(p) {
	try {
		await p;
	} catch (e) {
		//swallow
	}
}

function Deferred() {
	let f = null;
	let r = null;

	const p = new Promise((fulfill, reject) => {
		(f = fulfill), (r = reject);
	});

	return {
		fulfill: (...args) => (f(...args), p.then(pump, pump)),
		reject: (...args) => (r(...args), p.then(pump, pump)),

		method: () => p,
	};
}

function MockAction() {
	let deferreds = [];
	let calls = 0;

	const getDeferred = index => {
		if (!deferreds[index]) {
			deferreds[index] = Deferred();
		}

		return deferreds[index];
	};

	return {
		fulfill: (index, ...args) => getDeferred(index).fulfill(...args),
		reject: (index, ...args) => getDeferred(index).reject(...args),

		method: (...args) => getDeferred(calls++).method(...args),
	};
}

describe('DataStore Action Tests', () => {
	test('isAction check', () => {
		expect(Action.isAction(Action(() => {}))).toBeTruthy();
		expect(Action.isAction(() => {})).toBeFalsy();
	});

	test('passes args to implementation', () => {
		const method = jest.fn();
		const action = Action(method).bindStore({});

		action(1, 2, 3);
		expect(method).toHaveBeenCalledWith(1, 2, 3);
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

				await fulfill(0);
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

		//TODO: test read
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
			describe('Single Values', () => {
				test('gets called with value', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, method } = MockAction();

					const action = Action(method).bindStore(store);

					action();
					await fulfill(0, 1);

					action();
					await fulfill(1, 2);

					action();
					await fulfill(2, 3);

					expect(store.onUpdate).toHaveBeenCalledTimes(3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
				});

				test('gets called in the order the actions were called (not fulfilled)', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, method } = MockAction();

					const action = Action(method).bindStore(store);

					const one = action();
					const two = action();
					const third = action();

					await fulfill(2, 3);
					await fulfill(1, 2);
					await fulfill(0, 1);

					await third;
					await two;
					await one;

					expect(store.onUpdate).toHaveBeenCalledTimes(3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
				});

				test('gets called for subsequent actions after a failed run', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, reject, method } = MockAction();

					const action = Action(method).bindStore(store);

					const one = action();
					const two = action();
					const third = action();

					await fulfill(2, 3);
					await reject(1);
					await fulfill(0, 1);

					await third;
					await two;
					await one;

					expect(store.onUpdate).toHaveBeenCalledTimes(2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 3);
				});
			});

			describe('Iterator Values', () => {
				test('gets called with each iterator value', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, method } = MockAction();

					const action = Action(method).bindStore(store);

					action();
					await fulfill(0, [1, 2, 3][Symbol.iterator]());

					expect(store.onUpdate).toHaveBeenCalledTimes(3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
				});

				test('for multiple calls update gets called the values from each iterator in order', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, method } = MockAction();

					const action = Action(method).bindStore(store);

					const one = action();
					const two = action();
					const three = action();

					await fulfill(2, [7, 8, 9][Symbol.iterator]());
					await fulfill(1, [4, 5, 6][Symbol.iterator]());
					await fulfill(0, [1, 2, 3][Symbol.iterator]());

					await three;
					await two;
					await one;

					expect(store.onUpdate).toHaveBeenCalledTimes(9);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(4, 4);
					expect(store.onUpdate).toHaveBeenNthCalledWith(5, 5);
					expect(store.onUpdate).toHaveBeenNthCalledWith(6, 6);
					expect(store.onUpdate).toHaveBeenNthCalledWith(7, 7);
					expect(store.onUpdate).toHaveBeenNthCalledWith(8, 8);
					expect(store.onUpdate).toHaveBeenNthCalledWith(9, 9);
				});

				test('gets called for subsequent actions after a failed run', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, reject, method } = MockAction();

					const action = Action(method).bindStore(store);

					const one = action();
					const two = action();
					const three = action();

					await fulfill(2, [7, 8, 9][Symbol.iterator]());
					await reject(1);
					await fulfill(0, [1, 2, 3][Symbol.iterator]());

					await three;
					await two;
					await one;

					expect(store.onUpdate).toHaveBeenCalledTimes(6);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(4, 7);
					expect(store.onUpdate).toHaveBeenNthCalledWith(5, 8);
					expect(store.onUpdate).toHaveBeenNthCalledWith(6, 9);
				});
			});

			describe('Async-Iterator Values', () => {
				async function* doIterate(arr) {
					for (let i of arr) {
						await pump();
						yield i;
					}
				}

				test('gets called with each iterator value', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, method } = MockAction();

					const action = Action(method).bindStore(store);

					const call = action();
					await fulfill(0, doIterate([1, 2, 3]));
					await call;

					expect(store.onUpdate).toHaveBeenCalledTimes(3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
				});

				test('for multiple calls update gets called the values from each iterator in order', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, method } = MockAction();

					const action = Action(method).bindStore(store);

					const one = action();
					const two = action();
					const three = action();

					await fulfill(2, doIterate([7, 8, 9]));
					await fulfill(1, doIterate([4, 5, 6]));
					await fulfill(0, doIterate([1, 2, 3]));

					await three;
					await two;
					await one;

					expect(store.onUpdate).toHaveBeenCalledTimes(9);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(4, 4);
					expect(store.onUpdate).toHaveBeenNthCalledWith(5, 5);
					expect(store.onUpdate).toHaveBeenNthCalledWith(6, 6);
					expect(store.onUpdate).toHaveBeenNthCalledWith(7, 7);
					expect(store.onUpdate).toHaveBeenNthCalledWith(8, 8);
					expect(store.onUpdate).toHaveBeenNthCalledWith(9, 9);
				});

				test('gets called for subsequent actions after a failed run', async () => {
					const store = { onUpdate: jest.fn() };
					const { fulfill, reject, method } = MockAction();

					const action = Action(method).bindStore(store);

					const one = action();
					const two = action();
					const three = action();

					await fulfill(2, doIterate([7, 8, 9]));
					await reject(1);
					await fulfill(0, doIterate([1, 2, 3]));

					await three;
					await two;
					await one;

					expect(store.onUpdate).toHaveBeenCalledTimes(6);
					expect(store.onUpdate).toHaveBeenNthCalledWith(1, 1);
					expect(store.onUpdate).toHaveBeenNthCalledWith(2, 2);
					expect(store.onUpdate).toHaveBeenNthCalledWith(3, 3);
					expect(store.onUpdate).toHaveBeenNthCalledWith(4, 7);
					expect(store.onUpdate).toHaveBeenNthCalledWith(5, 8);
					expect(store.onUpdate).toHaveBeenNthCalledWith(6, 9);
				});
			});
		});
	});
});