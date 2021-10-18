/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import { useLink } from '../use-link';

test('useLink', async () => {
	const object = {
		hasLink: jest.fn().mockReturnValue(true),
		getLink: jest.fn().mockReturnValue('/foo'),
		fetchLink: jest.fn().mockReturnValue('passed'),
		getID: jest.fn().mockReturnValue('some-id:foo'),
	};
	const reload = {};

	const { result, waitForNextUpdate } = renderHook(() =>
		useLink(object, 'my-rel', { reload, foo: 'bar' })
	);

	await waitForNextUpdate();
	expect(result.current).toBe('passed');
	expect(object.getLink).toHaveBeenCalledWith('my-rel', { foo: 'bar' });
	expect(object.getLink).toHaveBeenCalledWith(
		'my-rel',
		expect.not.objectContaining({ reload })
	);
	expect(object.fetchLink).toHaveBeenCalledWith({
		mode: 'parse',
		rel: 'my-rel',
		params: {
			foo: 'bar',
		},
	});
	expect(object.fetchLink).toHaveBeenCalledWith({
		mode: 'parse',
		rel: 'my-rel',
		params: expect.not.objectContaining({ reload }),
	});
});

test('useLink - no link', async () => {
	const object = {
		hasLink: jest.fn().mockReturnValue(false),
		getLink: jest.fn().mockReturnValue(null),
		getID: jest.fn().mockReturnValue('some-id:foo'),
	};

	const { result, waitForNextUpdate } = renderHook(() =>
		useLink(object, 'my-rel')
	);
	await waitForNextUpdate();
	expect(result.current).toBe(null);
});

test('useLink - Bad reload nonce', async () => {
	const object = {
		getLink: jest.fn().mockReturnValue('/foo'),
		fetchLink: jest.fn().mockReturnValue('passed'),
		getID: jest.fn().mockReturnValue('some-id:foo'),
		hasLink: jest.fn().mockReturnValue(true),
	};

	const { result } = renderHook(() =>
		useLink(object, 'my-rel', { reload: true, foo: 'bar' })
	);

	expect(() => expect(result.current).toBe(undefined)).toThrowError(
		/Reload nonce should be/
	);
});
