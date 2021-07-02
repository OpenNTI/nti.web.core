/**
 * @typedef StoreBinding - bind the actions events to a set of callbacks
 * @property {*} scope - scope to bind the action calls to
 * @property {Function} onUpdate - called with every returns/yielded value
 * @property {Function} onStart - called every time an action is triggered
 * @property {Function} onError - called when most recent action fails
 * @property {Function} onFinish - called when the most recent action finishes
 */

/**
 * @typedef BoundAction - a function that passes result into a store and defines properties indicating if its running, has ran, or has erred.
 * @augments {Function}
 * @property {boolean} isAction - identifies the function as an action.
 * @property {(StoreBinding) => BoundAction} bindStore - returns a function that will call updates on a given store.
 * @property {boolean} hasRun - indicates if the action has been ran at all (successfully or not)
 * @property {boolean} running - indicates if a call to the action is inflight
 * @property {Error} error - the error of the most recent invocation
 */
//TODO: document BoundAction.read

/**
 * @typedef Action
 * @augments {Function}
 * @property {true} isAction - identifies the value as an action
 * @property {(StoreBinding) => BoundAction} bindAction - returns a
 */

import EventEmitter from 'events';

import { Promises } from '@nti/lib-commons';

const CurrentUpdated = 'updated';

/**
 * Binds an action to a store.
 *
 * Bound actions execute sequentially. Subsequent calls wait for the prev calls to finish.
 * Bound actions have no return. The results and errors are all pushed into the store binding.
 *
 * @param {Function} fn - Action to bind to a store
 * @param {StoreBinding} store - callbacks for updates from the action
 * @returns {BoundAction}
 */
function bindAction(fn, { scope, onUpdate, onStart, onError, onFinish }) {
	let current = null;
	const bus = new EventEmitter();
	const setCurrent = c => ((current = c), bus.emit(CurrentUpdated));
	const isCurrent = c => current === c;

	let runCount = 0;

	const execute = async (prev, ...args) => {
		if (prev instanceof Promise) {
			await prev.then(
				() => {},
				() => {}
			);
		}

		const result = await fn.apply(scope, args);

		if (!result?.next) {
			onUpdate?.(result);
			return result;
		}

		let pointer;

		do {
			pointer = await result.next();

			if (!pointer.done) {
				onUpdate?.(pointer.value);
			}
		} while (!pointer.done);

		return pointer?.value;
	};

	const action = async (...args) => {
		const task = execute(current, ...args);

		setCurrent(task);
		onStart?.();

		try {
			await task;

			if (isCurrent(task)) {
				setCurrent(null);
				onFinish?.();
			}
		} catch (e) {
			if (isCurrent(task)) {
				setCurrent(e);
				onError?.();
			}
		} finally {
			runCount += 1;
		}
	};

	Object.defineProperties(action, {
		isAction: { value: true },

		bindStore: {
			value: s => bindAction(fn, s),
		},

		hasRun: {
			get: () => runCount > 0,
		},

		running: { get: () => current instanceof Promise },
		error: { get: () => (current instanceof Error ? current : null) },

		read: {
			value: () => {
				const p = new Promise((fulfill, reject) => {
					if (!current) {
						fulfill();
					}

					const onCurrentUpdate = () => {
						if (current instanceof Promise) {
							return;
						}

						if (!current) {
							fulfill();
						}
						if (current instanceof Error) {
							reject();
						}

						bus.removeListener(CurrentUpdated, onCurrentUpdate);
					};

					bus.addListener(CurrentUpdated, onCurrentUpdate);
				});

				return Promises.toReader(p);
			},
		},
	});

	return action;
}

/**
 * Turn a function into an Action.
 *
 * @param {Function} fn - function to turn into an action
 * @returns {Action}
 */
export default function BuildAction(fn) {
	const action = (...args) => fn(...args);

	Object.defineProperties(action, {
		isAction: { value: true },
		bindStore: { value: s => bindAction(fn, s) },
	});

	return action;
}

BuildAction.isAction = x => x.isAction;
