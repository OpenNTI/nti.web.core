import React from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import { Row } from './Row';

const T = styled.table`
	/* By default, tables shrink to fit their contents, nearly all NextThought's
	   use of tables are for grids, so make this 100% like other "block" elements */
	width: 100%;

	/* https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
	  Table and column widths are set by the widths of table and col elements or
	  by the width of the first row of cells. Cells in subsequent rows do not
	  affect column widths. */
	table-layout: fixed;

	/* HTML spec defines the default table cells have individual borders.
	   We typically want thin shared borders. */
	border-collapse: collapse;
	border-spacing: 0;
`;

/**
 * A Generic Table component that takes two props: columns & items.
 *
 * To define a Column component, make its primary function render the cell in the
 * body of the table. Add static class properties called "HeaderComponent" and/or
 * "FooterComponent" if you need a header/footer. These static properties will be
 * used to flag whether or not to add the thead/tfoot.
 *
 * ```js
 * ExampleColumn.HeaderComponent = () => <div/>
 * function ExampleColumn ({item}) {
 *   return (
 *   	<div />
 *   );
 * }
 *
 * // or Class:
 *
 * class ExampleColumn extends React.Component {
 * 	static HeaderComponent = () => <div/>
 * 	static FooterComponent = () => <div/>
 * 	render () {
 * 		return (
 * 			<div />
 * 		);
 * 	}
 * }
 * ```
 *
 * @template T
 * @param {import('./Table').TableProps<T>} props
 * @returns {JSX.Element}
 */
export function Table({
	className,

	columns,
	items,

	rowClassName,
	onRowClick,

	...extraProps
}) {
	return (
		<T className={className}>
			<Header
				{...{
					columns,
					...extraProps,
				}}
			/>
			<Body
				{...{
					columns,
					items,
					rowClassName,
					onRowClick,
					...extraProps,
				}}
			/>
			<Footer {...{ columns }} />
		</T>
	);
}

/**
 * @template T
 * @param {import('./Table').CommonTableProps<T> & import('./Table').TableBodyProps<T>} props
 * @returns {JSX.Element}
 */
function Body({ columns, items, rowClassName, onRowClick: onClick, ...props }) {
	return (
		<tbody>
			{
				/*allow for any iterable*/
				[...(items || [])].map((item, row) => (
					<Row
						key={row}
						className={rowClassName?.(item, row, items)}
						{...{ item, columns, onClick, ...props }}
					/>
				))
			}
		</tbody>
	);
}
