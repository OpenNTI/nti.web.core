/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import { useAppUser } from '../use-app-user';

afterEach(tearDownTestClient);

test('useAppUser gets the app user', async () => {
	const user = {
		username: 'tester',
	};
	setupTestClient({
		getAppUser() {
			return Promise.resolve(user);
		},
	});
	const { result, waitForNextUpdate } = renderHook(() => useAppUser());
	await waitForNextUpdate();
	expect(result.current).toBe(user);
});
