import React from 'react';
import cx from 'classnames';

import { VariantGetter } from '../../../system/utils/PropGetters';
import { getSpacingProps } from '../../../system/css/get-spacing-props';
import { useMenubarKeys } from '../../menu/hooks/use-menubar-keys';
import { useActionable } from '../../button/hooks/use-actionable';

import Theme from './Pages.theme.css';

const getStyleVariant = VariantGetter(['buttons'], 'buttons');

const Page = ({ page, selected, load }) => {
	return (
		<li
			className={cx(Theme.page, { [Theme.selected]: selected })}
			role="menuitem"
			{...useActionable(() => load(page))}
		>
			<span>{page + 1}</span>
		</li>
	);
};

export function DiscretePages(propsArg) {
	const [style, props] = getStyleVariant(propsArg);
	const {
		className,
		total,
		selected,
		maxDisplay = 8,
		load,
	} = getSpacingProps(props);

	const [first, last] = getDisplayRange(total, selected, maxDisplay);
	const pages = Array.from({ length: last - first }, (_, i) => first + i);

	return (
		<ul
			className={cx(className, Theme.pager, Theme[style])}
			role="menubar"
			{...useMenubarKeys('li')}
		>
			{pages.map(page => (
				<Page
					key={page}
					page={page}
					selected={selected === page}
					load={load}
				/>
			))}
		</ul>
	);
}

function getDisplayRange(total, current, display) {
	const before = display / 2;
	const after = display / 2;

	return [Math.max(current - before, 0), Math.min(current + after, total)];
}
