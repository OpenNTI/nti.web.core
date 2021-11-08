export function setInput(cmp) {
	Object.defineProperty(cmp, 'isInput', {
		value: true,
		writable: false,
		enumerable: false,
		configurable: false,
	});

	return cmp;
}

export function isInput(cmp) {
	return cmp.isInput;
}
