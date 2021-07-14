import Store from '../Store';
import Context from '../../Context';

const MockServer = {
	get: path => {
		if (path === 'items') {
			return new Promise(fulfill => {
				setTimeout(() => {
					fulfill({
						items: [
							{ label: 'Item 1', id: 1 },
							{ label: 'Item 2', id: 2 },
							{ label: 'Item 3', id: 3 },
						],
					});
				}, 2000);
			});
		}
	},

	post: (path, data) => {
		if (path === 'items') {
			return new Promise(fulfill => {
				setTimeout(() => fulfill(data), 2000);
			});
		}
	},
};

class TodoListStore extends Store {
	load() {
		return MockServer.get('items');
	}

	addItem = Store.Action(async action => {
		const { items } = action.state;
		const nextItem = items.length + 1;

		const item = await MockServer.post('items', {
			label: `Item ${nextItem}`,
			id: nextItem,
		});

		return {
			items: [...action.state.items, item],
		};
	});
}

const ErrorCmp = e => <span>Error! {e}</span>;
const LoadingIndicator = () => <span>Loading...</span>;

const ItemList = () => {
	const { items } = TodoListStore.useProperties();

	return (
		<ul>
			{(items ?? []).map(item => (
				<li key={item.id}>{item.label}</li>
			))}
		</ul>
	);
};

const AddItem = () => {
	const { addItem } = TodoListStore.useProperties();

	return (
		<button onClick={addItem}>
			{addItem.running ? 'Saving...' : 'Add Item'}
		</button>
	);
};

export function Loading() {
	const store = TodoListStore.useStore();

	return (
		<Context
			store={store}
			fallback={<LoadingIndicator />}
			error={<ErrorCmp />}
		>
			<ItemList />
		</Context>
	);
}

export function WithAddItem() {
	const store = TodoListStore.useStore();

	return (
		<Context
			store={store}
			fallback={<LoadingIndicator />}
			error={<ErrorCmp />}
		>
			<ItemList />
			<AddItem />
		</Context>
	);
}
