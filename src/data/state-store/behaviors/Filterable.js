/**
 * Generate a StateStore that implements filtering.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Filterable = Base =>
	class extends Base {
		static FilterParam = 'filter';
		static DefaultFilter = null;

		static get PageResetParams() {
			const base = Base.PageResetParams ?? [];

			return [...base, this.FilterParam];
		}

		static get SelectionResetParams() {
			const base = Base.SelectionResetParams ?? [];

			return [...base, this.FilterParam];
		}

		constructor() {
			super();

			const filterParam = this.constructor.FilterParam;
			const defaultFilter = this.constructor.DefaultFilter;

			if (filterParam !== 'filter') {
				this.addDependentProperty('filter', filterParam);

				Object.defineProperty(this, 'filter', {
					get: () => this.getProperty(filterParam),
				});
			}

			if (defaultFilter) {
				this.setParams({
					[filterParam]: defaultFilter,
				});
			}
		}

		setFilter(filter) {
			this.setParams({
				[this.constructor.FilterParam]: filter,
			});
		}
	};
