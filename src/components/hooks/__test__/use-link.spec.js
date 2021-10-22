/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import { useLink } from '../use-link';

test('useLink', async () => {
	const object = {
		getLink: jest.fn().mockReturnValue('/foo'),
		fetchLinkParsed: jest.fn().mockReturnValue('passed'),
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
	expect(object.fetchLinkParsed).toHaveBeenCalledWith('my-rel', {
		foo: 'bar',
	});
	expect(object.fetchLinkParsed).toHaveBeenCalledWith(
		'my-rel',
		expect.not.objectContaining({ reload })
	);
});

test('useLink - Bad reload nonce', async () => {
	const object = {
		getLink: jest.fn().mockReturnValue('/foo'),
		fetchLinkParsed: jest.fn().mockReturnValue('passed'),
	};

	const { result } = renderHook(() =>
		useLink(object, 'my-rel', { reload: true, foo: 'bar' })
	);

	expect(() => expect(result.current).toBe(undefined)).toThrowError(
		/Reload nonce should be/
	);
});
