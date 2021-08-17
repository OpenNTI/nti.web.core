/**
 * Generate a StateStore that implements filtering.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Filterable = Base =>
	class extends Base {
		static get FilterParam() {
			return Base.FilterParam ?? 'filter';
		}
		static DefaultFilter = null;

		static get StatefulParams() {
			const base = Base.StatefulParams ?? [];

			return [...base, this.FilterParam];
		}

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

			if (filterParam !== 'filter') {
				this.addDependentProperty('filter', filterParam);

				Object.defineProperty(this, 'filter', {
					get: () => this.getProperty(filterParam),
				});
			}
		}

		getInitialParams() {
			const base = super.getInitialParams();
			const filter = {};

			const filterParam = this.constructor.FilterParam;
			const defaultFilter = this.constructor.DefaultFilter;

			if (defaultFilter) {
				filter[filterParam] = defaultFilter;
			}

			return {
				...filter,
				...base,
			};
		}

		setFilter(filter) {
			this.setParams({
				[this.constructor.FilterParam]: filter,
			});
		}
	};
