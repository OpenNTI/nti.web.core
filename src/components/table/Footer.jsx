import React from 'react';

const EMPTY = () => null;

/**
 * @param {Object} props
 * @param {import('./Table').ColumnStatic[]} props.columns
 * @returns {JSX.Element}
 */
export function Footer({ columns, ...props }) {
	const hasFooter = columns?.some(x => x.FooterComponent);
	return !hasFooter ? null : (
		<tfoot>
			<tr>
				{columns.map(({ FooterComponent = EMPTY, CSSClassName }, i) => (
					<th key={i} className={CSSClassName}>
						<FooterComponent {...props} />
					</th>
				))}
			</tr>
		</tfoot>
	);
}
