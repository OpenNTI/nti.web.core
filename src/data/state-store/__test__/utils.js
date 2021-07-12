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
