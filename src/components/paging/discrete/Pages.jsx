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
			tabIndex="0"
			aria-label={`Page ${page}`}
			{...useActionable(() => load(page))}
		>
			<span>{page}</span>
		</li>
	);
};

/** @typedef {import('../../../system/css/get-spacing-props').SpacingProps} SpacingProps */
/**
 * @typedef {object} DiscretePagingProps
 * @property {number} total Total number of pages (inclusive).
 * @property {number} selected The selected page.
 * @property {number} display The number of pages to show.
 * @property {(page: number) => void} load Load a new page selection.
 */

/**
 * Display the discrete set of pages.
 *
 * NOTE: pages use 1 based indexing NOT zero based.
 *
 * @param {(DiscretePagingProps & SpacingProps)} propsArg
 * @returns {JSX.Element}
 */
export function DiscretePages(propsArg) {
	const [style, props] = getStyleVariant(propsArg);

	const {
		as: Cmp = 'div',
		className,
		total,
		selected,
		display = 8,
		load,
	} = getSpacingProps(props);

	const [first, last] = getDisplayRange(total, selected, display);
	const pages = Array.from({ length: last - first }, (_, i) => first + i);

	return (
		<Cmp className={cx(className, Theme.pager, Theme[style])}>
			<ul role="menubar" {...useMenubarKeys('li')}>
				{pages.map(page => (
					<Page
						key={page}
						page={page}
						selected={selected === page}
						load={load}
					/>
				))}
			</ul>
		</Cmp>
	);
}

function getDisplayRange(total, current, display) {
	const before = display / 2 - 1;
	const after = display / 2;

	return [
		Math.max(current - before, 1),
		Math.min(current + after, total + 1),
	];
}
