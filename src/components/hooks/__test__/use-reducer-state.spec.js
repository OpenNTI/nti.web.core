/* eslint-env jest */
import { renderHook, act } from '@testing-library/react-hooks';

import { useReducerState } from '../use-reducer-state';

test('useReducerState', () => {
	let initial = { a: 'b' };
	const { result, rerender } = renderHook(() => useReducerState(initial));

	expect(result.current).toEqual([
		{ a: 'b' },
		expect.any(Function),
		expect.any(Function),
		expect.any(Function),
	]);

	initial = { nope: 'a' };
	rerender();

	//changing the initial state does not change current state.
	expect(result.current).toEqual([
		{ a: 'b' },
		expect.any(Function),
		expect.any(Function),
		expect.any(Function),
	]);

	const [, dispatch] = result.current;

	act(() => {
		dispatch({ foo: 'bar' });
	});

	expect(result.current).toEqual([
		{ a: 'b', foo: 'bar' },
		expect.any(Function),
		expect.any(Function),
		expect.any(Function),
	]);

	const [, , reset] = result.current;
	act(() => {
		reset();
	});

	expect(result.current).toEqual([
		{ nope: 'a' },
		expect.any(Function),
		expect.any(Function),
		expect.any(Function),
	]);

	const [, , , getSetter] = result.current;
	const setBar = getSetter('bar');
	act(() => {
		setBar('hi');
	});

	expect(result.current).toEqual([
		{ nope: 'a', bar: 'hi' },
		expect.any(Function),
		expect.any(Function),
		expect.any(Function),
	]);
});
