//@ts-check
import { Array as ArrayUtils } from '@nti/lib-commons';

import { DataView } from '../../data/DataView';

import { useAsyncValue } from './use-async-value';

/** @typedef {import('@nti/lib-interfaces/src/models').Base} Model */
/** @typedef {import('@nti/lib-interfaces/src/data-sources/data-types/Batch').default} Batch */
/** @typedef {import('../../data/DataView').FindPredicateCallback} FindPredicateCallback */

/**
 * @typedef {object} LinkOptions
 * @property {object=} reload
 * @property {FindPredicateCallback=} predicate
 */

/**
 *
 * @param {Model} object
 * @param {string} rel
 * @param {Record<string,string> & LinkOptions} options
 * @returns {Model|Model[]}
 */
export function useLink(
	object,
	rel,
	{ reload, predicate, ...givenParams } = {}
) {
	const dataContext = DataView.useContext(predicate);
	const params = pruneEmpty(
		Object.fromEntries([
			...(dataContext?.params.entries() || []),
			...Object.entries(givenParams),
		])
	);

	const key = object?.getLink(rel, params);
	if (!key) {
		throw new Error('No Link ' + rel);
	}

	const result = useAsyncValue(
		key,
		async () => object.fetchLink(rel, params, dataContext ? 'batch' : true),
		reload
	);

	if (dataContext) {
		const batch = /** @type {Batch} */ (result);
		dataContext.dispatch({ itemCount: batch.totalInContext });
	}

	return result;
}

/**
 * @param {Record<string, any>} o
 * @returns {Record<string, any>}
 */
function pruneEmpty(o) {
	return Object.fromEntries(Object.entries(o).filter(e => e[1]));
}

/**
 * An alias to useLink that forces the return type to be an array
 *
 * @param {Model} object
 * @param {string} rel
 * @param {Record<string,string> & LinkOptions} options
 * @returns {Model[]}
 */
export function useBatch(object, rel, options) {
	return ArrayUtils.ensure(useLink(object, rel, options));
}
