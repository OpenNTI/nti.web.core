/**
 * @typedef StoreBinding - bind the actions events to a set of callbacks
 * @property {*} scope - scope to bind the action calls to
 * @property {() => void} onUpdate - called with every returns/yielded value
 * @property {() => void} onStart - called every time an action is triggered
 * @property {() => void} onError - called when most recent action fails
 * @property {() => void} onFinish - called when the most recent action finishes
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

/**
 * @typedef Action
 * @augments {Function}
 * @property {true} isAction - identifies the value as an action
 * @property {(StoreBinding) => BoundAction} bindAction - returns a
 */

import EventEmitter from 'events';

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

	const execute = async (prev, args) => {
		if (prev instanceof Promise) {
			await prev.catch(() => {});
		}

		const result = await fn.apply(scope, args);

		if (!result?.next) {
			onUpdate?.(result);
			return;
		}

		let pointer;

		do {
			pointer = await result.next();

			if (!pointer.done) {
				onUpdate?.(pointer.value);
			}
		} while (!pointer.done);
	};

	const action = async (...args) => {
		const task = execute(current, args);

		setCurrent(task);
		onStart?.();

		try {
			await task;
			runCount += 1;

			if (isCurrent(task)) {
				setCurrent(null);
				onFinish?.();
			}
		} catch (e) {
			runCount += 1;

			if (isCurrent(task)) {
				setCurrent(e);
				onError?.();
			}
		}
	};

	Object.defineProperties(action, {
		hasRun: {
			get: () => runCount > 0,
		},

		running: { get: () => current instanceof Promise },
		error: { get: () => (current instanceof Error ? current : null) },
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
	const action = function (...args) {
		return fn.call(this, ...args);
	};

	Object.defineProperties(action, {
		isAction: { value: true },
		bindStore: { value: s => bindAction(fn, s) },
	});

	return action;
}
//TODO: Expose Concurrent and Superseded Actions (Sequential is the default)
//Sequential: wait for previous invocations to finish
//Superseded: cancel previous invocation
//Concurrent: run alongside any previous invocations

BuildAction.isAction = x => x.isAction;
