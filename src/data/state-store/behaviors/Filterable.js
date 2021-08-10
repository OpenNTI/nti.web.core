/**
 * Generate a StateStore that implements filtering.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Filterable = Base =>
	class extends Base {
		FilterParam = 'filter';
		DefaultFilter = null;

		constructor() {
			super();

			this.setParams({
				filter: this.DefaultFilter,
			});
		}

		setFilter(filter) {
			this.setParams({
				filter,
			});
		}
	};
