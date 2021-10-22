import { useState, useRef, useEffect } from 'react';

export const Fields = Base =>
	class extends Base {
		static useField(name, initial) {
			const { __registerField } = this.useProperty();

			const [value, setValue] = useState(initial);
			const valueRef = useRef();

			valueRef.current = value;

			useEffect(() => __registerField(name, valueRef), []);

			return [value, setValue];
		}

		static useFieldList(name, initial = []) {
			const { __registerField } = this.useProperty();

			const [list, setList] = useState(initial);
			const idRef = useRef(0);
			const listRef = useRef();

			listRef.current = list;

			useEffect(() => __registerField(name, listRef), []);

			const listStore = {
				addItem(value) {
					const id = idRef.current++;

					setList([
						...list,
						{
							id,
							value,
							onChange: newValue => list.updateItem(id, newValue),
						},
					]);
				},

				removeItem(item) {
					const removeId = item.id ?? item;

					setList(list.filter(i => i.id !== removeId));
				},

				updateItem(item, value) {
					const updateId = item.id ?? item;

					setList(
						list.map(i => (i.id === updateId ? { ...i, value } : i))
					);
				},
			};

			return listStore;
		}

		#fields = null;

		get fields() {
			this.#fields = this.#fields || new Map();

			return this.#fields;
		}

		__registerField(name, store) {
			const isAdded = !this.fields.has(name) && store;
			const isRemoved = this.fields.has(name) && !store;

			this.fields.set(name, store);

			if (isAdded || isRemoved) {
				this.onChange('fields');
			}

			return () => {
				if (this.fields.get(name) === store) {
					this.fields.delete(name);
					this.onChange('fields');
				}
			};
		}
	};
