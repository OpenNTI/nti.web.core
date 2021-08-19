import React from 'react';
import cx from 'classnames';

import Theme from './List.theme.css';

const Middot = '·';

export function InlineList({
	children,
	className,
	separator = Middot,
	...otherProps
}) {
	const items = React.Children.toArray(children).filter(
		x => x !== false && x != null
	);

	return (
		<ul className={cx(className, Theme.inlineList)} {...otherProps}>
			{items.map((item, index) => (
				<li key={index}>
					{item}
					<span className={Theme.separator} aria-hidden="true">
						{separator}
					</span>
				</li>
			))}
		</ul>
	);
}
