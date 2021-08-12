/**
 * Generate a StateStore that implements maintaining a selection.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Selectable = Base =>
	class extends Base {
		constructor() {
			super();

			this.addDependentProperty('isSelected', 'selection');
			this.addDependentProperty('isAllSelected', 'selection');
		}

		/**
		 * Check if two selectable items are the same.
		 *
		 * @override
		 * @param {*} a
		 * @param {*} b
		 * @returns {boolean}
		 */
		isSameSelectable(a, b) {
			return a === b;
		}

		/**
		 * Get all selectable items
		 *
		 * @override
		 * @returns {Array}
		 */
		getSelectable() {
			return this.get('items');
		}

		/**
		 * Check if the item is in the current selection.
		 *
		 * @param {*} item
		 * @returns {boolean}
		 */
		isSelected(item) {
			const selection = this.get('selection') ?? [];

			return (
				selection.findIndex(s => this.isSameSelectable(s, item)) !== -1
			);
		}

		/**
		 * Check if all selectable items are in the current selection
		 *
		 * @returns {boolean}
		 */
		isAllSelected() {
			const selectable = this.getSelectable();
			const selection = this.get('selection');

			if (!selectable?.length || !selection?.length) {
				return false;
			}

			return selectable.every(s => this.isSelected(s));
		}

		/**
		 * Add the item to the current selection.
		 * No-ops if the item is already in the current selection.
		 *
		 * @param {*} item
		 * @returns {void}
		 */
		select(item) {
			if (this.isSelected(item)) {
				return;
			}

			const selection = this.get('selection') ?? [];

			this.updateState({
				selection: [...selection, item],
			});
		}

		/**
		 * Remove the item from the current selection.
		 * No-ops if the item is not in the current selection.
		 *
		 * @param {*} item
		 * @returns {void}
		 */
		deselect(item) {
			if (!this.isSelected(item)) {
				return;
			}

			const selection = this.get('selection') ?? [];

			this.updateState({
				selection: selection.filter(s => s !== item),
			});
		}

		/**
		 * Add all the current selectable items to the current selection.
		 *
		 * @returns {void}
		 */
		selectAll() {
			const selectable = this.getSelectable() ?? [];

			if (!selectable?.length) {
				return;
			}

			const current = this.get('selection') ?? [];

			let newSelection = [...current];

			for (let item of selectable) {
				if (!this.isSelected(item)) {
					newSelection.push(item);
				}
			}

			this.updateState({ selection: newSelection });
		}

		/**
		 * Remove all the current selectable items from the current selection.
		 *
		 * @returns {void}
		 */
		deselectAll() {
			const selectable = this.getSelectable() ?? [];
			const current = this.get('selection') ?? [];

			if (!selectable?.length || !current?.length) {
				return;
			}

			this.updateState({
				selection: current.filter(c =>
					selectable.every(s => !this.isSameSelectable(c, s))
				),
			});
		}
	};
