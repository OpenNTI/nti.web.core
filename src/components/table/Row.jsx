import React from 'react';

/** @typedef {(item: any, e: Event) => void} EventHandler */
/** @typedef {import('./Table').Column} Column */

/**
 *
 * @param {Object} props
 * @param {Column[]} props.columns
 * @param {any} props.item
 * @param {EventHandler=} props.onClick
 * @returns {JSX.Element}
 */
export function Row({ columns, item, onClick, ...props }) {
	const clickHandler = !onClick ? null : e => onClick(item, e);

	return (
		<tr onClick={clickHandler}>
			{columns.map((Cell, cell) =>
				Cell.rendersContainer ? (
					<Cell key={cell} item={item} {...props} />
				) : (
					<td
						key={cell}
						className={Cell.cssClassName}
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