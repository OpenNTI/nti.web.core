/* eslint-env jest */
import { render } from '@testing-library/react';

import { Table } from '../Table';

describe('Table', () => {
	test('Basic', () => {
		const A = Table.asBasicColumn(({ item }) => item, 'A');
		const B = Table.asBasicColumn(({ item }) => item * 2, 'B');
		const c = render(<Table columns={[A, B]} items={[1, 2]} />);
		expect(c.asFragment()).toMatchSnapshot();
	});

	test('Basic With Sorting', () => {
		const A = Table.asBasicColumn(({ item }) => item, 'A', 'foo');
		const B = Table.asBasicColumn(({ item }) => item * 2, 'B', 'bar');
		const props = {
			columns: [A, B],
			items: [1, 2],
			sortOn: 'bar',
			sortDirection: 'ascending',
		};

		const c = render(<Table {...props} />);
		const firstPass = c.asFragment();
		expect(firstPass).toMatchSnapshot();

		c.rerender(<Table {...props} onChangeSort={jest.fn()} />);

		expect(c.asFragment()).toMatchSnapshot();

		c.rerender(
			<Table
				{...props}
				onChangeSort={jest.fn()}
				sortDirection="descending"
			/>
		);

		expect(c.asFragment()).toMatchSnapshot();
	});

	test('Column can render its TD', () => {
		function Custom() {
			return <td data-custom="td">foo</td>;
		}
		Custom.RendersContainer = true;

		const c = render(<Table columns={[Custom]} items={[1]} />);
		expect(c.container.querySelector('td[data-custom]')).toBeTruthy();
		expect(c.asFragment()).toMatchSnapshot();
	});

	test('CSSClassName', () => {
		function Custom() {
			return 'yo';
		}
		Custom.CSSClassName = 'my-classname';

		const c = render(<Table columns={[Custom]} items={[1]} />);

		expect(c.container.querySelector('.my-classname')).toBeTruthy();
	});

	test('rowClassName', () => {
		const Column = x => x.item;
		const rowClassName = jest.fn().mockReturnValue('custom-row');
		const items = [1, 2, 3];
		const c = render(
			<Table
				columns={[Table.asBasicColumn(Column, 'A')]}
				items={items}
				rowClassName={rowClassName}
			/>
		);

		expect(rowClassName).toBeCalledTimes(3);
		expect(rowClassName).toBeCalledWith(1, 0, items);
		expect(rowClassName).toBeCalledWith(2, 1, items);
		expect(rowClassName).toBeCalledWith(3, 2, items);
		expect(c.container.querySelectorAll('tr.custom-row').length).toBe(3);
	});

	test('Extra props pass through', () => {
		const Column = jest.fn().mockReturnValue('foo');
		const date = new Date();
		render(
			<Table
				columns={[Table.asBasicColumn(Column, 'A')]}
				items={[1]}
				myCustomProp={date}
			/>
		);

		expect(Column).toBeCalledWith(
			expect.objectContaining({
				item: 1,
				myCustomProp: date,
			}),
			expect.anything()
		);
	});

	test('Custom Header', () => {
		const Column = jest.fn().mockReturnValue('foo');
		Column.HeaderComponent = () => (
			<div className="custom" data-header="custom">
				My Header
			</div>
		);

		const c = render(<Table columns={[Column]} items={[1]} />);
		expect(
			c.container.querySelectorAll('thead .custom[data-header="custom"]')
		).toBeTruthy();
		expect(c.asFragment()).toMatchSnapshot();
	});

	test('Custom Footer', () => {
		const Column = jest.fn().mockReturnValue('foo');
		Column.FooterComponent = () => (
			<div className="custom" data-footer="custom">
				My Footer
			</div>
		);

		const c = render(<Table columns={[Column]} items={[1]} />);
		expect(
			c.container.querySelectorAll('tfoot .custom[data-footer="custom"]')
		).toBeTruthy();
		expect(c.asFragment()).toMatchSnapshot();
	});
});
