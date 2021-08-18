/**
 * Generate a StateStore that implements maintaining a selection.
 *
 * @template {import('../../../types').Constructor} T
 * @param {T} Base
 * @mixin
 */
export const Selectable = Base =>
	class extends Base {
		get ResetSelectionParams() {
			return Base.ResetSelectionParams() ?? [];
		}

		initializeBehavior() {
			super.initializeBehavior?.();
			this.addDependentProperty('isSelected', 'selection');
			this.addDependentProperty('isAllSelected', 'selection');
			this.addDependentProperty('selectionCount', 'selection');
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
			return this.getProperty('items');
		}

		get selectionCount() {
			return (this.getProperty('selection') ?? []).length;
		}

		/**
		 * Check if the item is in the current selection.
		 *
		 * @param {*} item
		 * @returns {boolean}
		 */
		isSelected(item) {
			const selection = this.getProperty('selection') ?? [];

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
			const selection = this.getProperty('selection');

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

			const selection = this.getProperty('selection') ?? [];

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

			const selection = this.getProperty('selection') ?? [];

			this.updateState({
				selection: selection.filter(
					s => !this.isSameSelectable(s, item)
				),
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

			const current = this.getProperty('selection') ?? [];

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
			const current = this.getProperty('selection') ?? [];

			if (!selectable?.length || !current?.length) {
				return;
			}

			this.updateState({
				selection: current.filter(c =>
					selectable.every(s => !this.isSameSelectable(c, s))
				),
			});
		}

		clearSelection() {
			this.updateState({ selection: [] });
		}

		onParamsUpdate(current, prev) {
			const baseCleanup = super.onParamsUpdate();

			for (let reset of this.SelectionResetParams) {
				if (
					current[reset] != null &&
					prev[reset] != null &&
					current[reset] !== prev[reset]
				) {
					this.clearSelection();
				}
			}

			return baseCleanup;
		}
	};
