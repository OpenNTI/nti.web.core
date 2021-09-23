/**
 * Generate a StateStore that implements sorting.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Sortable = Base =>
	class extends Base {
		isSortable = true;

		SortOnParam = 'sortOn';
		SortOrderParam = 'sortOrder';

		DefaultSortOn = null;
		DefaultSortOrder = null;

		get StatefulParams() {
			const base = super.StatefulParams ?? [];

			return [...base, this.SortOnParam, this.SortOrderParam];
		}

		initializeBehavior() {
			super.initializeBehavior?.();

			const sortOnParam = this.sortOnParam;
			const sortOrderParam = this.SortOrderParam;

			if (sortOnParam !== 'sortOn') {
				this.addDependentProperty('sortOn', sortOnParam);

				Object.defineProperty(this, 'sortOn', {
					get: () => this.getProperty(sortOnParam),
				});
			}

			if (sortOrderParam !== 'sortOrder') {
				this.addDependentProperty('sortOrder', sortOrderParam);

				Object.defineProperty(this, 'sortOrder', {
					get: () => this.getProperty(sortOrderParam),
				});
			}
		}

		getInitialParams() {
			const base = super.getInitialParams();
			const sort = {};

			const sortOn = this.DefaultSortOn;
			const sortOrder = this.DefaultSortOrder;

			if (sortOn) {
				sort[this.SortOnParam] = sortOn;
			}
			if (sortOrder) {
				sort[this.SortOrderParam] = sortOrder;
			}

			return {
				...sort,
				...base,
			};
		}

		setSort(property, direction) {
			this.setParams({
				[this.SortOnParam]: property,
				[this.SortOrderParam]: direction,
			});
		}

		setSortProperty(property) {
			this.setParams({ [this.SortOnParam]: property });
		}

		setSortOrder(direction) {
			this.setParams({ [this.SortOrderParam]: direction });
		}
	};

/**
 * Predicate to match stores that have the sortable behavior.
 *
 * @param {import('../../hooks/user-store').StoreInstance} s
 * @returns {boolean}
 */
Sortable.hasBehavior = s => s.isSortable;
