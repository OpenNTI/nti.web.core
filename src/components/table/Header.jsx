import React from 'react';

import { SimpleHeader } from './headers/Simple';

/** @typedef {import('./Table').Column} Column */

const NONE = () => null;

/**
 * @param {React.ComponentPropsWithoutRef<'div'>} props
 * @param {import('../../types').AsProp=} [props.as='tr']
 * @param {Column[]} props.columns
 * @param {string=} props.sortOn
 * @param {string=} props.sortDirection
 * @param {import('./Table').SortChangeHandler} props.onSortChange
 * @returns {JSX.Element}
 */
export function Header({
	as: Cmp = 'tr',
	columns,
	sortOn,
	sortDirection,
	onSortChange,
	...otherProps
}) {
	const InnerCmp = Cmp === 'tr' ? 'th' : 'div';

	return (
		<Cmp>
			{columns.map(
				(
					{ HeaderComponent = NONE, cssClassName, Name, SortKey },
					i
				) => (
					(HeaderComponent =
						HeaderComponent === NONE && Name
							? SimpleHeader
							: HeaderComponent),
					(
						<InnerCmp key={i} className={cssClassName}>
							<HeaderComponent
								onSortChange={onSortChange}
								name={Name}
								sortDirection={sortDirection}
								sortKey={SortKey}
								sortOn={sortOn}
								{...otherProps}
							/>
						</InnerCmp>
					)
				)
			)}
		</Cmp>
	);
}
