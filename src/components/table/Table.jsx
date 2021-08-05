import React from 'react';

import { Header } from './Header';
import { Row } from './Row';

const EMPTY = () => null;

/** @typedef {(sortOn: string, sortDirection: string) => void} SortChangeHandler */
/** @typedef {(item: any, e: Event) => void} ClickHandler */

/**
 * @typedef {Object} ColumnProps
 * @property {string=} className
 * @property {any} item
 */
/**
 * @typedef {React.Component<ColumnProps, any, any>} Column
 * @property {React.Component=} HeaderComponent
 * @property {React.Component=} FooterComponent
 * @property {React.Component=} Name
 * @property {string=} cssClassName
 * @property {string=} SortKey
 * @property {boolean=} rendersContainer
 */

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
 *   class ExampleColumn extends React.Component {
 *   	static propTypes = {
 *   		item: PropTypes.object.isRequired
 *   	}
 *
 *   	static HeaderComponent = () => <div/>	// These can be imported and assigned
 *   											// if you have a complex header/footer
 *   	static FooterComponent = () => <div/>
 *
 *   	render () {
 *   		return (
 *   			<div />
 *   		);
 *   	}
 *   }
 *
 * @param {Object} props
 * @param {string=} props.className
 * @param {Column[]} props.columns
 * @param {any[]=} props.items
 * @param {string=} props.rowClassName
 * @param {string=} props.sortOn
 * @param {string=} props.sortDirection
 * @param {SortChangeHandler=} props.onSortChange
 * @param {ClickHandler=} props.onRowClick
 * @returns {JSX.Element}
 */
export function Table({
	className,
	columns,
	items,
	rowClassName,
	sortOn,
	sortDirection,
	onSortChange,
	onRowClick,
	...props
}) {
	const hasHeader = columns.some(x => x.HeaderComponent || x.Name);
	const hasFooter = columns.some(x => x.FooterComponent);

	return (
		<T className={className}>
			{hasHeader && (
				<thead>
					<Header
						columns={columns}
						sortOn={sortOn}
						sortDirection={sortDirection}
						onSortChange={onSortChange}
						{...props}
					/>
				</thead>
			)}

			<tbody>
				{
					/*allow for any iterable*/ [...items].map((item, row) => (
						<Row
							key={row}
							item={item}
							columns={columns}
							className={
								!rowClassName
									? void 0
									: rowClassName(item, row, items)
							}
							onClick={onRowClick}
							{...props}
						/>
					))
				}
			</tbody>

			{hasFooter && (
				<tfoot>
					<tr>
						{columns.map(
							({ FooterComponent = EMPTY, cssClassName }, i) => (
								<th key={i} className={cssClassName}>
									<FooterComponent {...props} />
								</th>
							)
						)}
					</tr>
				</tfoot>
			)}
		</T>
	);
}
