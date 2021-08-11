import React from 'react';
import cx from 'classnames';

import { ASCENDING, DESCENDING } from '../../constants';

const Box = styled.div`
	font-size: 10px;
	color: var(--tertiary-grey);
	font-weight: 600;
	text-transform: uppercase;
	text-align: left;

	&.sortable {
		cursor: pointer;

		& > i[class*='icon-chevron-'] {
			margin-left: 5px;
		}
	}
`;

/** @typedef {{SortOn?: string} & import('../Table').SortProps} Sortable */
/** @typedef {() => string} NameGetter */
/** @typedef {{name?: string | NameGetter}} Named */

/**
 *
 * @param {Named & Sortable} props
 * @returns {JSX.Element}
 */
export function SimpleTableHeader({
	onChangeSort,
	SortOn, // note the case of the property. Capital first letter suggests its constant. (it comes from a static property of the column component)
	sortOn, // this lower-case version is the 'current state'.
	sortDirection,
	name,
}) {
	const sortable = Boolean(onChangeSort) && Boolean(SortOn);
	const isSorted = sortable && sortOn === SortOn;
	const showChevron = isSorted && onChangeSort;
	const sort = () =>
		SortOn &&
		onChangeSort?.(
			SortOn,
			isSorted
				? // Only toggle direction when already sorted on.
				  sortDirection === ASCENDING
					? DESCENDING
					: ASCENDING
				: // when changing what is sorted on, always reset direction to ascending.
				  ASCENDING
		);
	return (
		<Box
			sortable={sortable}
			onClick={sort}
			className={cx({
				sortable,
				sorted: isSorted,
				asc: isSorted && sortDirection === ASCENDING,
				desc: isSorted && sortDirection === DESCENDING,
			})}
		>
			<span>{typeof name === 'function' ? name() : name}</span>
			{showChevron ? (
				<i
					className={
						sortDirection === ASCENDING
							? 'icon-chevron-down'
							: 'icon-chevron-up'
					}
				/>
			) : null}
		</Box>
	);
}
