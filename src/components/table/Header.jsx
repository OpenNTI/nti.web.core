import React from 'react';

import { SimpleHeader } from './headers/Simple';

const NONE = () => null;

/**
 * @param {Object} props
 * @param {import('../../types').AsProp=} props.as
 * @param {import('./Table').ColumnStatic[]} props.columns
 * @param {string=} props.sortOn
 * @param {string=} props.sortDirection
 * @param {import('../../types').SortChangeHandler=} props.onSortChange
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
	const hasHeader = columns.some(x => x.HeaderComponent || x.Name);
	const InnerCmp = Cmp === 'tr' ? 'th' : 'div';
	const Wrapper = Cmp === 'tr' ? 'thead' : React.Fragment;

	return (
		hasHeader && (
			<Wrapper>
				<Cmp>
					{columns.map(
						(
							{
								HeaderComponent = NONE,
								cssClassName,
								Name,
								SortKey,
							},
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
			</Wrapper>
		)
	);
}
