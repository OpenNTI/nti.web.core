const noop = () => {};

function bindAction(fn, { scope, onUpdate, onStart, onError, onFinish }) {
	let current = null;
	let runCount = 0;

	const execute = async (...args) => {
		const result = await fn.apply(scope, args);

		if (!result.next) {
			onUpdate?.(result);
			return result;
		}

		let pointer;

		do {
			pointer = await result.next();
			onUpdate?.(pointer.value);
		} while (!pointer.done);

		return pointer?.value;
	};

	const action = async (...args) => {
		const task = (current = execute(...args));

		onStart?.();

		try {
			const result = await current;

			runCount += 1;

			if (current === task) {
				current = result;
				onFinish?.();
			}

			return result;
		} catch (e) {
			if (current === task) {
				current = e;
				onError?.();
			}
		}
	};

	Object.defineProperties(action, {
		hasRan: {
			getter: () => runCount >= 1,
		},

		running: { getter: () => current instanceof Promise },
		error: { getter: () => (current instanceof Error ? current : null) },

		reader: {
			getter: () => {
				if (current instanceof Error) {
					throw current;
				}

				return current;
			},
		},
	});

	return action;
}

export default function BuildAction(fn) {
	return {
		isAction: true,
		bindStore: s => bindAction(fn, s),
	};
}

BuildAction.isAction = x => x.isAction;
