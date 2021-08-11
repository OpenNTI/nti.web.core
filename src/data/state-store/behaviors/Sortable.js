/**
 * Generate a StateStore that implements sorting.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Sortable = Base =>
	class extends Base {
		static DefaultSortOn = null;
		static DefaultSortDirection = null;

		constructor() {
			super();

			this.setParams({
				sortOn: this.constructor.DefaultSortOn,
				sortOrder: this.constructor.DefaultSortDirection,
			});
		}

		setSort(property, direction) {
			this.setParams({
				sortOn: property,
				sortOrder: direction,
			});
		}

		setSortProperty(property) {
			this.setParams({ sortOn: property });
		}

		setSortDirection(direction) {
			this.setParams({ sortOrder: direction });
		}
	};
