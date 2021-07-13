/** @typedef {{}} Batch */

export const Continuous = () => {}; //TODO: fill this out

/**
 * Generate a StateStore that implements discrete batch paging.
 *
 * To utilize the paging have the load method return a `batch` property.
 *
 * @template {import('./constants').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Discrete = Base =>
	class extends Base {
		PageSize = 25;

		constructor() {
			super();

			this.addDependentProperty('items', 'batch');
			this.addDependentProperty('totalPages', 'batch');
			this.addDependentProperty('currentPage', 'batch');

			this.setParams({
				batchSize: this.PageSize,
				batchStart: 0,
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

			return batch.FilteredTotalItemCount != null
				? batch.FilteredTotalItemCount
				: batch.TotalCount;
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

		loadPage(index) {
			this.setParam({
				batchStart: this.PageSize * Math.max(index - 1, 0),
			});
		}
	};
