/**
 * Generate a StateStore that implements sorting.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Sortable = Base =>
	class extends Base {
		static DefaultSortProperty = null;
		static DefaultSortDirection = null;

		constructor() {
			super();

			this.setParams({
				sortProperty: this.constructor.DefaultSortProperty,
				sortDirection: this.constructor.DefaultSortDirection,
			});
		}

		setSort(property, direction) {
			this.setParams({
				sortProperty: property,
				sortDirection: direction,
			});
		}

		setSortProperty(property) {
			this.setParams({ sortProperty: property });
		}

		setSortDirection(direction) {
			this.setParams({ sortDirection: direction });
		}
	};
