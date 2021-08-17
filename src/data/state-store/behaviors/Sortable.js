/**
 * Generate a StateStore that implements sorting.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Sortable = Base =>
	class extends Base {
		static SortOnParam = 'sortOn';
		static SortOrderParam = 'sortOrder';

		static DefaultSortOn = null;
		static DefaultSortOrder = null;

		static get StatefulParams() {
			const base = Base.StatefulParams ?? [];

			return [...base, this.SortOnParam, this.SortOrderParam];
		}

		constructor() {
			super();

			const sortOnParam = this.constructor.sortOnParam;
			const sortOrderParam = this.constructor.SortOrderParam;

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

			const sortOn = this.constructor.DefaultSortOn;
			const sortOrder = this.constructor.DefaultSortOrder;

			if (sortOn) {
				sort[this.constructor.SortOnParam] = sortOn;
			}
			if (sortOrder) {
				sort[this.constructor.SortOrderParam] = sortOrder;
			}

			return {
				...sort,
				...base,
			};
		}

		setSort(property, direction) {
			this.setParams({
				[this.constructor.SortOnParam]: property,
				[this.constructor.SortOrderParam]: direction,
			});
		}

		setSortProperty(property) {
			this.setParams({ [this.constructor.SortOnParam]: property });
		}

		setSortOrder(direction) {
			this.setParams({ [this.constructor.SortOrderParam]: direction });
		}
	};
