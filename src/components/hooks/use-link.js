import { useAsyncValue } from './use-async-value';

/** @typedef {import('@nti/lib-interfaces/src/models/Base').default} Model */

/**
 *
 * @param {Model} object
 * @param {string} rel
 * @param {Record<string,string>} params
 * @returns {Model|Model[]}
 */
export function useLink(object, rel, { reload, ...params } = {}) {
	const id = `${object.getID()}-${rel}`;
	const key = object?.getLink(rel, params) ?? id;

	return useAsyncValue(
		key,
		async () =>
			object.hasLink(rel) ? object.fetchLink({ rel, params }) : null,
		reload
	);
}
