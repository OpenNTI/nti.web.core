import { useAsyncValue } from './use-async-value';

/** @typedef {import('@nti/lib-interfaces/src/models/Base').default} Model */

/**
 *
 * @param {Model} object
 * @param {string} rel
 * @param {object} options
 * @param {object?} options.reload
 * @param {import('@nti/lib-interfaces/src/mixins/HasLinks').ParseMode?} options.mode
 * @returns {Model|Model[]}
 */
export function useLink(
	object,
	rel,
	{ reload, mode = 'parse', ...params } = {}
) {
	const id = `${object.getID()}-${rel}`;
	const key = object?.getLink(rel, params) ?? id;

	return useAsyncValue(
		key,
		async () =>
			object.hasLink(rel)
				? object.fetchLink({ rel, mode, params })
				: null,
		reload
	);
}
