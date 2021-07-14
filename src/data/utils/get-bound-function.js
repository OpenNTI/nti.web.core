const Scopes = new WeakMap();

export default function getBoundFunction(fn, scope) {
	if (fn.isBound) {
		return fn;
	}

	if (!Scopes.has(scope)) {
		Scopes.set(scope, new WeakMap());
	}

	const cache = Scopes.get(scope);

	if (!cache.has(fn)) {
		cache.set(
			fn,
			Object.assign(fn.bind(scope), {
				source: fn.source || fn.toString(),
			})
		);
	}

	return cache.get(fn);
}
