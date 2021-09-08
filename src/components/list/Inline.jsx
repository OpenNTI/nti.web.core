import React from 'react';
import cx from 'classnames';

import Theme from './List.theme.css';

const Middot = (
	<span className={Theme.middot} aria-hidden="true">
		·
	</span>
);

export const InlineList = React.forwardRef(
	({ children, className, separator = Middot, ...otherProps }, ref) => {
		const items = React.Children.toArray(children).filter(
			x => x !== false && x != null
		);

		return (
			<ul className={cx(className, Theme.inlineList)} {...otherProps}>
				{items.map((item, index, list) => (
					<li key={index}>
						{item}
						{!isLast(index, list) && separator}
					</li>
				))}
			</ul>
		);
	}
);

function isLast(index, { length }) {
	return index >= length - 1;
}
