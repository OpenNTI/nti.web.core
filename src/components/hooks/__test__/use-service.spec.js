/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import { useService } from '../use-service';

afterEach(tearDownTestClient);

test('useService gets the service', async () => {
	const service = {};
	setupTestClient(service);
	const { result, waitForNextUpdate } = renderHook(() => useService());

	await waitForNextUpdate();
	expect(result.current).toBe(service);
});
