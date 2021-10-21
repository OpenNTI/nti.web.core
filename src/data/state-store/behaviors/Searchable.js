const PendingSearchTerm = Symbol('searchTermPending');

/**
 * Generate a StateStore that implements searching.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Searchable = Base =>
	class extends Base {
		isSearchable = true;

		SearchParam = 'searchTerm';
		SearchBuffer = 300;

		get PageResetParams() {
			const base = super.PageResetParams ?? [];

			return [...base, this.SearchParam];
		}

		initializeBehavior() {
			super.initializeBehavior?.();
			this.addDependentProperty('searchTerm', PendingSearchTerm);
			if (this.#searchBuffering) {
				clearTimeout(this.#searchBuffer);
				super.setParams({ [this.SearchParam]: this.searchTerm });
			}
		}

		setParams({ searchTerm, ...params }) {
			this.setSearchTerm(searchTerm);
			super.setParams(params);
		}

		get searchTerm() {
			return this.getProperty(PendingSearchTerm);
		}

		get isSearchBuffering() {
			return this.#searchBuffering;
		}

		#searchBuffer = null;
		#searchBuffering = false;

		setSearchTerm(term) {
			//NOTE: We are pushing the search term into the state as it updates.
			//we are hiding it behind a symbol to avoid any confusion with the buffered
			//search param value.
			this.updateState({ [PendingSearchTerm]: term });

			this.#searchBuffering = true;
			clearTimeout(this.#searchBuffer);

			if (!term) {
				this.#searchBuffering = false;

				if (this.getParam(this.SearchParam)) {
					super.setParams({ [this.SearchParam]: null });
				}
			} else {
				this.#searchBuffer = setTimeout(() => {
					this.#searchBuffering = false;
					super.setParams({ [this.SearchParam]: term });
				}, this.SearchBuffer);
			}
		}
	};

/**
 * Predicate to match stores that have the searchable behavior.
 *
 * @param {import('../../hooks/user-store').StoreInstance} s
 * @returns {boolean}
 */
Searchable.hasBehavior = s => s.isSearchable;
