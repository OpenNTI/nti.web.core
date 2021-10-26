/** @typedef {import('@nti/lib-interfaces').Models.Base} Model */
/** @typedef {import('@nti/lib-interfaces').Batch} Batch */

import { getPropertyDescriptor } from '@nti/lib-commons';

export const Continuous = () => {}; //TODO: fill this out

/**
 * Generate a StateStore that implements discrete batch paging.
 *
 * To utilize the paging have the load method return a `batch` property.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Discrete = Base =>
	class extends Base {
		isDiscretePaging = true;

		PageSize = 25;

		PageSizeParam = 'batchSize';
		PageOffsetParam = 'batchStart';

		get PageResetParams() {
			return Base.PageResetParams ?? [];
		}

		initializeBehavior() {
			super.initializeBehavior?.();
			const computedProperties = ['currentPage', 'items', 'totalPages'];

			// if the subclass wants to let the batch define the page size, add it to the computed properties (suspense enabled)
			if (this.PageSize == null) {
				computedProperties.push('pageSize');
			}

			for (let property of computedProperties) {
				this.addDependentProperty(property, ['load', 'batch']);
				const { get: read, ...desc } = getPropertyDescriptor(
					this,
					property
				);
				// make the property "read"able
				delete this[property];
				Object.defineProperty(this, property, {
					...desc,
					get: Object.assign(read.bind(this), {
						read: () => {
							this.load.read();
							return read.call(this);
						},
					}),
				});
			}
		}

		getInitialParams() {
			const base = super.getInitialParams();

			return {
				[this.PageSizeParam]: this.PageSize,
				[this.PageOffsetParam]: 0,
				...base,
			};
		}

		/** @type {Model[]} */
		get items() {
			try {
				return [...this.getProperty('batch')];
			} catch {
				return [];
			}
		}

		/** @type {number?} */
		get total() {
			return this.getProperty('batch')?.total ?? null;
		}

		/** @type {number?} */
		get totalPages() {
			return this.getProperty('batch')?.pageCount ?? null;
		}

		/** @type {number?} */
		get currentPage() {
			return this.getProperty('batch')?.currentPage ?? null;
		}

		/** @type {number?} */
		get pageSize() {
			return this.PageSize ?? this.getProperty('batch')?.pageSize ?? null;
		}

		loadPage(index) {
			// TODO: should this get the params from the batch?
			this.setParams({
				[this.PageOffsetParam]: this.pageSize * Math.max(index - 1, 0),
			});
		}

		mergeParams(newParams, oldParams) {
			const merged = super.mergeParams(newParams, oldParams);

			for (let reset of this.PageResetParams) {
				if (merged[reset] !== oldParams[reset]) {
					merged[this.PageOffsetParam] = 0;
				}
			}

			return merged;
		}
	};

/**
 * Predicate to match stores that have the discrete paging behavior.
 *
 * @param {import('../../hooks/user-store').StoreInstance} s
 * @returns {boolean}
 */
Discrete.hasBehavior = s => s.isDiscretePaging;
