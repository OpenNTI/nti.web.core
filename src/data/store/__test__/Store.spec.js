/* eslint-env jest */
import Store from '../Store';

function pump() {
	return new Promise(fulfill => {
		setTimeout(() => fulfill(), 1);
	});
}

describe('DataStore', () => {
	describe('read', () => {
		xtest('throws a promise if initialLoad has not been called', () => {
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

		xtest('throws same promise if called multiple times before initialLoad', () => {
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

		xtest('throws promise if the initialLoad is in flight', () => {
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

			try {
				await test.initialLoad();
			} catch (e) {
				//swallow
			}

			await pump();

			let thrown = null;

			try {
				test.read();
			} catch (e) {
				thrown = e;
			}

			expect(thrown).toBe(err);
		});
	});
});
