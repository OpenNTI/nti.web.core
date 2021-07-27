export function setIcon(fn) {
	fn.isIcon = true;
	return fn;
}

export function isIcon(fn) {
	return fn?.isIcon;
}
