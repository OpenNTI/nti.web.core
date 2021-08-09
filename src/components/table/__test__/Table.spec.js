/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import { Table } from '../Table';

const makeSimpleColumn = (fn, name, sortOn) =>
	Object.assign(fn, { Name: name, SortOn: sortOn });

describe('Table', () => {
	test('Basic', () => {
		const A = makeSimpleColumn(({ item }) => item, 'A');
		const B = makeSimpleColumn(({ item }) => item * 2, 'B');
		const c = render(<Table columns={[A, B]} items={[1, 2]} />);
		expect(c.asFragment()).toMatchInlineSnapshot();
	});

	test('Basic With Sorting', () => {
		const A = makeSimpleColumn(({ item }) => item, 'A', 'foo');
		const B = makeSimpleColumn(({ item }) => item * 2, 'B', 'bar');

		const c = render(
			<Table
				columns={[A, B]}
				items={[1, 2]}
				sortOn="bar"
				sortDirection="ascending"
			/>
		);
		expect(c.asFragment()).toMatchInlineSnapshot();
	});

	test('Column can render its TD');
	test('Extra props pass through');
	test('CSSClassName');
	test('rowClassName');
	test('Custom Header');
	test('Custom Footer');
});
