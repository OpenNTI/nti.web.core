//@ts-check
import React from 'react';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import { EmptyState } from '../notice/EmptyState';
import { VariantGetter } from '../../system/utils/PropGetters';
import { Placeholder } from '../placeholder/Placeholder';

import Theme from './Table.theme.css';
import { Footer } from './Footer';
import { Header } from './Header';
import { Row } from './Row';
export { SimpleTableHeader } from './headers/Simple';

const t = scoped('generic.tables', {
	empty: 'Nothing to see here.',
});

const getTableVariant = VariantGetter(['plain', 'ruled'], 'plain');

const ColumnToPlaceholder = column => {
	const PlaceholderColumn = () => {
		const Cmp = column.Placeholder ?? Placeholder.Text;

		return <Cmp />;
	};

	PlaceholderColumn.FooterComponent =
		column.HeaderPlaceholderComponent ?? column.FooterComponent;
	PlaceholderColumn.HeaderComponent =
		column.HeaderPlaceholderComponent ?? column.HeaderComponent;
	PlaceholderColumn.Name = column.Name;
	PlaceholderColumn.CSSClassName = column.CSSClassName;

	return PlaceholderColumn;
};

export const TablePlaceholder = ({ rows, columns, ...otherProps }) => (
	<Table
		items={Array.from({ length: rows })}
		columns={columns.map(ColumnToPlaceholder)}
		{...otherProps}
	/>
);

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
	const [variant] = getTableVariant(extraProps);

	return (
		<table className={cx(className, Theme.table, Theme[variant])}>
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
		</table>
	);
}

/**
 * @template T
 * @param {import('./Table').CommonTableProps<T> & import('./Table').TableBodyProps<T>} props
 * @returns {JSX.Element}
 */
function Body({ columns, items, rowClassName, onRowClick: onClick, ...props }) {
	/*allow for any iterable*/
	const rows = [...(items || [])];
	return (
		<tbody>
			{!rows?.length ? (
				<Empty
					{...{
						columns,
						items,
						onRowClick: onClick,
						rowClassName,
						...props,
					}}
				/>
			) : (
				rows.map((item, row) => (
					<Row
						key={row}
						className={rowClassName?.(item, row, items)}
						{...{
							item,
							columns,
							onClick,
							...props,
						}}
					/>
				))
			)}
		</tbody>
	);
}

/**
 * @template T
 * @param {import('./Table').CommonTableProps<T> & import('./Table').TableBodyProps<T>} props
 * @returns {JSX.Element}
 */
function Empty({ columns, emptyFallback, ...props }) {
	return (
		<tr className={Theme.empty}>
			<td colSpan={columns.length}>
				{emptyFallback ? (
					React.cloneElement(emptyFallback, {
						columns,
						...props,
					})
				) : (
					<EmptyState>{t('empty')}</EmptyState>
				)}
			</td>
		</tr>
	);
}

/** @typedef {() => string} NameGetter */

/**
 * Apply static Type keys to the component so it is a basic column.
 *
 * @template T
 * @param {React.ComponentType<T>} CellComponent
 * @param {string | NameGetter} name
 * @param {string} sortOn
 * @returns {React.ComponentType<T>}
 */
Table.asBasicColumn = (CellComponent, name, sortOn = null) =>
	Object.assign(CellComponent, { Name: name, SortOn: sortOn });
