const SearchTerm = Symbol('searchTerm');

/**
 * Generate a StateStore that implements searching.
 *
 * @template {import('./constants').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Searchable = Base =>
	class extends Base {
		SearchBuffer = 300;

		constructor() {
			super();

			this.addDependentProperty('searchTerm', SearchTerm);
		}

		get searchTerm() {
			return this.get(SearchTerm);
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
			this.updateState({ [SearchTerm]: term });

			this.#searchBuffering = true;
			clearTimeout(this.#searchBuffer);

			if (!term) {
				this.#searchBuffering = false;
				this.setParams({ searchTerm: null });
			} else {
				this.#searchBuffer = setTimeout(() => {
					this.#searchBuffering = false;
					this.setParams({ searchTerm: term });
				}, this.SearchBuffer);
			}
		}
	};
