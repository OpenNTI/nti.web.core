import './Simple.scss';
import React from 'react';
import cx from 'classnames';

import { ASCENDING, DESCENDING } from '../Constants';

const Box = styled.div`
	font-size: 10px;
	color: var(--tertiary-grey);
	font-weight: 600;
	text-transform: uppercase;
	text-align: left;

	&.sortable {
		cursor: pointer;

		i {
			margin-left: 5px;
		}
	}
`;

/**
 *
 * @param {Object} props
 * @param {import('../Table').SortChangeHandler} props.onSortChange
 * @param {string=} props.sortKey
 * @param {string=} props.sortOn
 * @param {string=} props.sortDirection
 * @param {string|React.Component} props.name
 * @returns {JSX.Element}
 */
export function SimpleHeader({
	onSortChange,
	sortKey,
	sortOn,
	sortDirection,
	name,
}) {
	const sort = () =>
		sortKey &&
		onSortChange?.(
			sortKey,
			sortDirection === ASCENDING ? DESCENDING : ASCENDING
		);

	const isSorted = sortKey && sortOn === sortKey;
	const showChevron = sortKey && onSortChange && isSorted;

	const classes = cx({
		sortable: Boolean(onSortChange) && Boolean(sortKey),
		sorted: isSorted,
		asc: isSorted && sortDirection === ASCENDING,
		desc: isSorted && sortDirection === DESCENDING,
	});

	return (
		<Box onClick={sort} className={classes}>
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
