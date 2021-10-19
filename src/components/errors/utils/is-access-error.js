export function isAccessError(error) {
	if (error?.statusCode != null) {
		const code = parseInt(error.statusCode, 10); //just a precaution, should already be an int.
		return code > 400 && code < 404;
	}

	return false;
}
