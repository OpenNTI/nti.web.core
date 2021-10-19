/** @typedef {{}} Batch */

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
			this.addDependentProperty('items', 'batch');
			this.addDependentProperty('totalPages', 'batch');
			this.addDependentProperty('currentPage', 'batch');
		}

		getInitialParams() {
			const base = super.getInitialParams();

			return {
				[this.PageSizeParam]: this.PageSize,
				[this.PageOffsetParam]: 0,
				...base,
			};
		}

		/**
		 * Get the items from a given batch.
		 *
		 * @param {Batch} batch
		 * @returns {[]}
		 */
		getItemsFromBatch(batch) {
			try {
				return batch ? [...batch] : [];
			} catch {
				return [];
			}
		}

		/**
		 * Get the total number of pages from a given batch.
		 *
		 * @param {Batch} batch
		 * @returns {number}
		 */
		getTotalPagesFromBatch(batch) {
			if (!batch) {
				return null;
			}

			return batch.pageCount;
		}

		/**
		 * Get the current page from a given batch.
		 *
		 * @param {Batch} batch
		 * @returns {number}
		 */
		getCurrentPageFromBatch(batch) {
			return batch?.currentPage;
		}

		get items() {
			return this.getItemsFromBatch(this.getProperty('batch'));
		}

		get totalPages() {
			return this.getTotalPagesFromBatch(this.getProperty('batch'));
		}

		get currentPage() {
			return this.getCurrentPageFromBatch(this.getProperty('batch'));
		}

		get pageSize() {
			return this.PageSize ?? this.getProperty('batch')?.pageSize;
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
