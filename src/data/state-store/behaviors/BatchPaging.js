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
		static PageSize = 25;

		static PageSizeParam = 'batchSize';
		static PageOffsetParam = 'batchStart';

		static get PageResetParams() {
			return Base.PageResetParams ?? [];
		}

		constructor() {
			super();

			this.addDependentProperty('items', 'batch');
			this.addDependentProperty('totalPages', 'batch');
			this.addDependentProperty('currentPage', 'batch');

			this.setParams({
				[this.constructor.PageSizeParam]: this.constructor.PageSize,
				[this.constructor.PageOffsetParam]: 0,
			});
		}

		/**
		 * Get the items from a given batch.
		 *
		 * @param {Batch} batch
		 * @returns {[]}
		 */
		getItemsFromBatch(batch) {
			return batch?.Items;
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

			const total =
				batch.FilteredTotalItemCount != null
					? batch.FilteredTotalItemCount
					: batch.total;

			return Math.ceil(total / this.constructor.PageSize);
		}

		/**
		 * Get the current page from a given batch.
		 *
		 * @param {Batch} batch
		 * @returns {number}
		 */
		getCurrentPageFromBatch(batch) {
			return batch?.BatchPage;
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
			return this.constructor.PageSize;
		}

		loadPage(index) {
			this.setParams({
				[this.constructor.PageOffsetParam]:
					this.constructor.PageSize * Math.max(index - 1, 0),
			});
		}

		mergeParams(newParams, oldParams) {
			const merged = super.mergeParams(newParams, oldParams);

			for (let reset of this.constructor.PageResetParams) {
				if (
					newParams[reset] != null &&
					oldParams[reset] != null &&
					newParams[reset] !== oldParams[reset]
				) {
					merged[this.constructor.PageOffsetParam] = 0;
				}
			}

			return merged;
		}
	};
