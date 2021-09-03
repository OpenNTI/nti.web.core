//@ts-check
import React, { useContext, useEffect } from 'react';

import { buffer } from '@nti/lib-commons';

import { useReducerState } from '../components/hooks/use-reducer-state';

/** @typedef {(x: any) => void} Setter */
/** @typedef {[Setter, any]} SetterValuePair */
/** @typedef {(layer: ContextLayer, index: number, layers: ContextLayer[]) => boolean} FindPredicateCallback */
/**
 * @typedef {object} ContextLayer
 * @property {(state: any)=>void} dispatch This exposes the dispatch for the reducer. You can set any value with this.
 * @property {(filter: string) => void} setFilter
 * @property {(pageOffset: string) => void} setPageOffset
 * @property {(pageSize: string) => void} setPageSize
 * @property {(search: string) => void} setSearch
 * @property {string=} filter
 * @property {number} pageCount
 * @property {number} pageCurrent
 * @property {number} [pageOffset=0]
 * @property {number=} [pageSize=25]
 * @property {string=} search
 * @property {boolean} [searching=false]
 * @property {number=} itemCount
 * @property {URLSearchParams} params
 */

export const DataViewContext = React.createContext(
	/** @type {ContextLayer[]} */ ([])
);

/**
 * Composes a component in a DataView
 *
 * @template T
 * @param {React.ComponentType<T>} Component
 * @returns {React.ComponentType<T>}
 */
export function withFilterParams(Component) {
	return props => <DataView>{() => <Component {...props} />}</DataView>;
}

/**
 * @param {ContextLayer} currentDataContext
 * @param {object} DataViewUnusedProps
 * @returns {JSX.Element}
 */
const DataViewRenderer = (currentDataContext, DataViewUnusedProps) => <div />;

/**
 * @param {FindPredicateCallback} predicate
 * @returns {ContextLayer?}
 */
DataView.useContext = predicate => {
	const layers = useContext(DataViewContext);
	return predicate ? layers.find(predicate) : layers[0];
};

/**
 *
 * @param {object} props
 * @param {DataViewRenderer} props.children
 * @param {string} [props.filterParam='filter']
 * @param {string} [props.filter]
 * @param {string} [props.pageOffsetParam='batchStart']
 * @param {number} [props.pageOffset]
 * @param {string} [props.pageSizeParam='batchSize']
 * @param {number} [props.pageSize=25]
 * @param {string} [props.searchParam='searchTerm']
 * @param {string} [props.search]
 * @param {number} [props.searchBuffer=300]
 * @returns {JSX.Element}
 */
export function DataView({
	filterParam = 'filter',
	filter: _filterProp,
	pageOffsetParam = 'batchStart',
	pageOffset: _pageOffsetProp = 0,
	pageSizeParam = 'batchSize',
	pageSize: _pageSizeProp = 25,
	searchParam = 'searchTerm',
	search: _searchProp,
	searchBuffer = 300,
	...props
}) {
	const filterDeps = [
		filterParam,
		pageOffsetParam,
		pageSizeParam,
		searchParam,
	];

	const [
		{
			[filterParam]: filter,
			[pageOffsetParam]: pageOffset,
			[pageSizeParam]: pageSize,
			[searchParam]: search,
			...params
		},
		dispatch,
		// eslint-disable-next-line no-unused-vars
		reset,
		getSetter,
	] = useReducerState(
		{
			[filterParam]: _filterProp,
			[pageOffsetParam]: _pageOffsetProp,
			[pageSizeParam]: _pageSizeProp,
			[searchParam]: _searchProp,
			itemCount: 0,
		},
		filterDeps
	);

	const setFilter = getSetter(filterParam);
	const setPageOffset = getSetter(pageOffsetParam);
	const setPageSize = getSetter(pageSizeParam);
	const setSearch = getSetter(searchParam);
	const setSearching = getSetter('searching');

	/** @type {SetterValuePair[]} */
	const PropSynchronizers = [
		[setFilter, _filterProp],
		[setPageOffset, _pageOffsetProp],
		[setPageSize, _pageSizeProp],
		[setSearch, _searchProp],
	];

	for (const [setter, value] of PropSynchronizers) {
		useEffect(setter.bind(null, value), [setter, value]);
	}

	const layer = /** @type {ContextLayer} */ ({
		dispatch,
		//
		setFilter,
		setPageOffset,
		setPageSize,
		setSearch: buffer(300, setSearch, setSearching),
		//
		filter,
		pageOffset,
		pageSize,
		search,
		// searching, itemCount, etc
		...params,
		get pageCount() {
			// NaN until itemCount is set (by the useBatch/useLink within the context)
			return Math.ceil(
				/** @type {number} */ (params.itemCount) /
					/** @type {number} */ (pageSize)
			);
		},
		get pageCurrent() {
			return Math.ceil(this.pageOffset / this.pageSize) + 1;
		},
		//
		params: new URLSearchParams(
			[
				[filterParam, filter],
				[pageOffsetParam, pageOffset],
				[pageSizeParam, pageSize],
				[searchParam, search],
			]
				.filter(([, a]) => a)
				// make ts happy ensuring all values are strings
				.map(e => e.map(v => String(v)))
		),

		// question: only associate from context? vs auto-link based on context alone?
		// useLink: () => useLink()
	});

	Object.freeze(layer);

	// ordered closest to farthest in hierarchy.
	const layers = [layer, ...useContext(DataViewContext)];
	return (
		<DataViewContext.Provider value={layers}>
			<Layer {...props} currentLayer={layer} />
		</DataViewContext.Provider>
	);
}

/**
 * Allows for useContext for the DataView to be used within the renderer
 *
 * @private
 * @param {object} props
 * @param {DataViewRenderer} props.children
 * @param {ContextLayer} props.currentLayer
 * @returns {JSX.Element}
 */
function Layer({
	currentLayer,
	children: render = DataViewRenderer,
	...props
}) {
	return render(currentLayer, props);
}
