import React from 'react';

/** @typedef {(item: any, e: Event) => void} EventHandler */

/**
 * @template T
 * @param {Object} props
 * @param {import('./Table').Column<T>[]} props.columns
 * @param {any} props.item
 * @param {EventHandler=} props.onClick
 * @returns {JSX.Element}
 */
export function Row({ columns, item, onClick, ...props }) {
	const clickHandler = !onClick ? null : e => onClick(item, e);

	return (
		<tr onClick={clickHandler}>
			{columns.map((Cell, cell) =>
				Cell.RendersContainer ? (
					<Cell key={cell} item={item} {...props} />
				) : (
					<td
						key={cell}
						className={Cell.CSSClassName}
						data-name={
							typeof Cell.Name === 'string' ? Cell.Name : void 0
						}
					>
						<Cell item={item} {...props} />
					</td>
				)
			)}
		</tr>
	);
}
