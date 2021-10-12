import { de } from 'date-fns/locale';

export function pump() {
	return new Promise(fulfill => {
		setTimeout(() => fulfill(), 1);
	});
}

export async function swallow(p) {
	try {
		await p;
	} catch (e) {
		//swallow
	}
}

export function Deferred() {
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

export function MockAction() {
	let deferreds = [];
	let calls = 0;

	let updates = {};

	const getDeferred = index => {
		if (!deferreds[index]) {
			deferreds[index] = Deferred();
		}

		return deferreds[index];
	};

	return {
		update: (index, update) => {
			const callUpdates = updates[index] ?? {};

			if (callUpdates.update) {
				callUpdates.update(update);
			} else {
				callUpdates.updates = callUpdates.updates ?? [];
				callUpdates.updates.push(update);
			}
		},

		fulfill: (index, ...args) => getDeferred(index).fulfill(...args),
		reject: (index, ...args) => getDeferred(index).reject(...args),

		method: (action, ...args) => {
			const call = calls++;
			const callUpdates = updates[call] ?? {};

			updates[call] = callUpdates;

			for (let update of callUpdates.updates ?? []) {
				action.store.update(update);
			}

			callUpdates.update = action.store.update;

			return getDeferred(call).method();
		},
	};
}
