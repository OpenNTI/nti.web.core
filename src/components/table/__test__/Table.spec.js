/* eslint-env jest */
import React from 'react';
import { render } from '@testing-library/react';

import { Table } from '../Table';

describe('Table', () => {
	test.skip('Basic', () => {
		const A = Table.asBasicColumn(({ item }) => item, 'A');
		const B = Table.asBasicColumn(({ item }) => item * 2, 'B');
		const c = render(<Table columns={[A, B]} items={[1, 2]} />);
		expect(c.asFragment()).toMatchInlineSnapshot();
	});

	test.skip('Basic With Sorting', () => {
		const A = Table.asBasicColumn(({ item }) => item, 'A', 'foo');
		const B = Table.asBasicColumn(({ item }) => item * 2, 'B', 'bar');

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

	test.todo('Column can render its TD');
	test.todo('Extra props pass through');
	test.todo('CSSClassName');
	test.todo('rowClassName');
	test.todo('Custom Header');
	test.todo('Custom Footer');
});
