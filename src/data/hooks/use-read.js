import Context from '../Context';

const Identity = x => x;

export default function useRead(predicate) {
	const { stores } = Context.useContext();
	const filtered = predicate?.read
		? [predicate]
		: stores.filter(predicate ?? Identity);

	const store = filtered[filtered.length - 1];

	return store?.read();
}
