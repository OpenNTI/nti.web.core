function bindAction(fn, { scope, onUpdate, onStart, onError, onFinish }) {
	let current = null;

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

			if (current === task) {
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
		running: { getter: () => current instanceof Promise },
		error: { get: () => (current instanceof Error ? current : null) },
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
