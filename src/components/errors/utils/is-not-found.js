export function isNotFound(error) {
	if (error?.statusCode != null) {
		const code = parseInt(error.statusCode, 10); //just a precaution, should already be an int.
		return code === 404;
	}

	return false;
}
