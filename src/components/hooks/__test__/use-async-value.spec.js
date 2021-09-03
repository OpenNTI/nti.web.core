/* eslint-env jest */
import { renderHook } from '@testing-library/react-hooks';

import { useAsyncValue } from '../use-async-value';

test('useAsyncValue', async () => {
	const factory = jest.fn().mockReturnValue(Promise.resolve('w00t'));
	const key = 'test-w00t';
	let reload = {};

	const { result, rerender, waitForNextUpdate } = renderHook(() =>
		useAsyncValue(key, factory, reload)
	);
	await waitForNextUpdate();

	expect(result.current).toBe('w00t');
	expect(factory).toHaveBeenCalledWith();
	expect(factory).toHaveBeenCalledTimes(1);

	factory.mockClear();
	rerender();

	expect(result.current).toBe('w00t');
	expect(factory).not.toHaveBeenCalled();

	reload = {};
	factory.mockClear();
	rerender();
	await waitForNextUpdate();

	expect(result.current).toBe('w00t');
	expect(factory).toHaveBeenCalledWith();
	expect(factory).toHaveBeenCalledTimes(1);
});
