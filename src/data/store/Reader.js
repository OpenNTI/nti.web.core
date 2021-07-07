import { Promises } from '@nti/lib-commons';

export function createReader(store) {
	const loaded = new Promise((fulfill, reject) => {
		let cleanup = null;

		cleanup = store.subscribeToProperties('initialLoad', () => {
			console.log('initialLoad changed', store.initialLoad.error);
			if (store.initialLoad.error) {
				reject(store.initialLoad.error);
				cleanup?.();
			} else if (store.initialLoad.hasRun) {
				fulfill(store);
				cleanup?.();
			}
		});
	});

	return Promises.toReader(loaded);
}
