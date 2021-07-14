import { Promises } from '@nti/lib-commons';

export function createReader(store) {
	const loaded = new Promise((fulfill, reject) => {
		if (store.load.error) {
			reject(store.load.error);
			return;
		}

		if (store.load.hasRun) {
			fulfill(store);
			return;
		}

		const cleanup = store.subscribeToProperties('load', () => {
			if (store.load.error) {
				reject(store.load.error);
				cleanup();
			} else if (store.load.hasRun) {
				fulfill(store);
				cleanup();
			}
		});
	});

	return Promises.toReader(loaded);
}
