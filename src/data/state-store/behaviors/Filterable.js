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

		get StatefulParams() {
			const base = super.StatefulParams ?? [];

			return [...base, this.FilterParam];
		}

		get PageResetParams() {
			const base = super.PageResetParams ?? [];

			return [...base, this.FilterParam];
		}

		get SelectionResetParams() {
			const base = super.SelectionResetParams ?? [];

			return [...base, this.FilterParam];
		}

		initializeBehavior() {
			super.initializeBehavior?.();

			const { FilterParam: filterParam } = this;

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

			const filterParam = this.FilterParam;
			const defaultFilter = this.DefaultFilter;

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
				[this.FilterParam]: filter,
			});
		}
	};
