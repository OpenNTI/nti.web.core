/* eslint-env jest */
import { render, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Suspense } from 'react';

import {
	setupTestClient,
	tearDownTestClient,
} from '@nti/web-client/test-utils';

import { useObject, NTObject } from '../use-object';

afterEach(tearDownTestClient);

test('useObject', async () => {
	const object = {};
	const getObject = jest.fn().mockReturnValue(Promise.resolve(object));
	setupTestClient({
		getObject,
	});
	const { result, waitForNextUpdate } = renderHook(() =>
		useObject('the-id-of-this-object')
	);
	await waitForNextUpdate();
	expect(result.current).toBe(object);
	expect(getObject).toHaveBeenCalledTimes(1);
	expect(getObject).toHaveBeenCalledWith('the-id-of-this-object', void 0);
});

test('useObject with Type', async () => {
	const object = {};
	const Type = { MimeType: 'foobar' };
	const getObject = jest.fn().mockReturnValue(Promise.resolve(object));
	setupTestClient({
		getObject,
	});
	const { result, waitForNextUpdate } = renderHook(() =>
		useObject('the-id-of-this-object', Type)
	);
	await waitForNextUpdate();
	expect(result.current).toBe(object);
	expect(getObject).toHaveBeenCalledTimes(1);
	expect(getObject).toHaveBeenCalledWith('the-id-of-this-object', {
		type: Type.MimeType,
	});
});

test('NTObject', async () => {
	setupTestClient({
		getObject: async () => 'your-data-is-here',
	});
	const results = render(
		<Suspense fallback={<div />}>
			<NTObject id="the-id-of-this-object" prop="children">
				<span></span>
			</NTObject>
		</Suspense>
	);

	await waitFor(() =>
		expect(results.getByText('your-data-is-here')).toMatchObject({
			tagName: 'SPAN',
			textContent: 'your-data-is-here',
		})
	);
});
