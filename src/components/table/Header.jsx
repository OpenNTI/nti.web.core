import React from 'react';

import { SimpleHeader } from './headers/Simple';

const NONE = () => null;

/**
 * @param {Object} props
 * @param {import('../../types').AsProp=} props.as
 * @param {import('./Table').ColumnStatic[]} props.columns
 * @returns {JSX.Element}
 */
export function Header({ as: Cmp = 'tr', columns, ...otherProps }) {
	const hasHeader = columns?.some(x => x.HeaderComponent || x.Name);
	const InnerCmp = Cmp === 'tr' ? 'th' : 'div';
	const Wrapper = Cmp === 'tr' ? 'thead' : React.Fragment;

	return !hasHeader ? null : (
		<Wrapper>
			<Cmp>
				{columns.map(
					(
						{ HeaderComponent = NONE, CSSClassName, Name, ...misc },
						i
					) => (
						(HeaderComponent =
							HeaderComponent === NONE && Name
								? SimpleHeader
								: HeaderComponent),
						(
							<InnerCmp key={i} className={CSSClassName}>
								<HeaderComponent
									name={Name}
									{...misc}
									{...otherProps}
								/>
							</InnerCmp>
						)
					)
				)}
			</Cmp>
		</Wrapper>
	);
}
