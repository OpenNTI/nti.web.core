/**
 * @typedef StoreBinding - bind the actions events to a set of callbacks
 * @property {*} scope - scope to bind the action calls to
 * @property {() => {}} getData - get extra data to add to the action object
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

/** @typedef {{abort: () => void}} PrevAction */
/** @typedef {{aborted: boolean}} Signal */
/** @typedef {{prev:PrevAction, signal:Signal}} ActionObject */
/** @typedef {(ActionObject) => *} ActionCallback */

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
 * Bound actions have no return. The results and errors are all pushed into the store binding.
 *
 * @param {ActionCallback} fn - Action to bind to a store
 * @param {StoreBinding} store - callbacks for updates from the action
 * @returns {BoundAction}
 */
function bindAction(
	fn,
	{ scope, getData, onUpdate, onStart, onError, onFinish }
) {
	let current = null;
	const bus = new EventEmitter();
	const setCurrent = c => ((current = c), bus.emit(CurrentUpdated));
	const isCurrent = c => current === c;

	let runCount = 0;

	async function execute(prev, signal, args) {
		const actionObject = {};
		const store = getData?.() ?? {};

		Object.defineProperties(store, {
			update: {
				value: (...args) => {
					if (!signal.aborted) {
						onUpdate(...args);
					}
				},
			},
		});

		Object.defineProperties(actionObject, {
			prev: { value: prev instanceof Promise ? prev : null },
			signal: { value: signal },
			store: { value: store },
		});

		return fn.apply(scope ?? this, [actionObject, ...args]);
	}

	async function action(...args) {
		const abortController = new AbortController();
		const task = execute.call(this, current, abortController.signal, args);

		Object.defineProperty(task, 'abort', {
			value: () => abortController.abort(),
		});

		setCurrent(task);
		onStart?.();

		try {
			const result = await task;
			runCount += 1;

			if (isCurrent(task)) {
				setCurrent(null);
				onFinish?.();
			}

			return result;
		} catch (e) {
			runCount += 1;

			if (isCurrent(task)) {
				setCurrent(
					e === task
						? new Error(
								[
									'It appears we attempted to suspend outside of a render.',
									'The likely cause is a call to `read` occurred while evaluting the action.',
									'Which means a derived property dependent on this action was used within a store lifecycle or method.',
								].join('\n ')
						  )
						: e
				);
				onError?.();
			}
		}
	}

	Object.defineProperties(action, {
		isBound: { value: true },

		hasRun: {
			get: () => runCount > 0,
		},

		running: { get: () => current instanceof Promise },
		error: { get: () => (current instanceof Error ? current : null) },

		read: {
			value: () => {
				if (current instanceof Promise) {
					throw current;
				}
				if (current instanceof Error) {
					throw current;
				}

				return current;
			},
		},
	});

	return action;
}

/**
 * Turn a function into an Action.
 *
 * @param {ActionCallback} fn - function to turn into an action
 * @returns {Action}
 */
function BuildAction(fn) {
	const action = function (...args) {
		return fn.call(this, ...args);
	};

	Object.defineProperties(action, {
		isAction: { value: true },
		bindStore: { value: s => bindAction(fn, s) },
	});

	return action;
}

/**
 * Sequential:
 * Waits for previous invocations to finish before executing a new call.
 *
 * @param {ActionCallback} fn
 * @returns {Action}
 */
const Action = fn =>
	BuildAction(async function (e, ...args) {
		//This is avoiding using ?. to save an event pump if there is no prev
		if (e.prev) {
			await e.prev.catch(() => {});
		}
		return fn(e, ...args);
	});

/**
 * Superseded:
 * A new call will abort a pending previous invocation.
 *
 * @param {ActionCallback} fn
 * @returns {Action}
 */
Action.Superseded = fn =>
	BuildAction(function (e, ...args) {
		e.prev?.abort();
		return fn(e, ...args);
	});

/**
 * Concurrent:
 * New calls will run in "parallel" to any pending previous invocations.
 * There is no guarantee on the order they will resolve in.
 *
 * @param {ActionCallback} fn
 * @returns {Action}
 */
Action.Concurrent = fn => BuildAction(fn);

Action.isAction = x => x.isAction;

export default Action;
