import cx from 'classnames';

import { useMenubarKeys } from '../hooks/use-menubar-keys';
import { getTypographyProps } from '../../../system/css/get-typography-props';
import { getSpacingProps } from '../../../system/css/get-spacing-props';
import { useActionable } from '../../button/hooks/use-actionable';
import { Check as CheckIcon } from '../../icons/Check';

import Theme from './List.theme.css';
import { getValue, getLabel, getKey } from './Option';

const t = x => x;

function MenuItem({ option, getText, active, onClick }) {
	const label = getLabel(option);

	return (
		<li
			{...getTypographyProps(
				getSpacingProps(
					{
						className: cx(Theme.menuItem, {
							[Theme.selected]: active,
						}),
						tabIndex: '0',
						...useActionable(onClick),
					},
					{ pv: 'md', pl: 'xl', pr: 'lg' }
				),
				{ type: 'body' }
			)}
		>
			{active && <CheckIcon className={Theme.check} />}
			<span>{getText(label)}</span>
		</li>
	);
}

export function MenuList({
	options,
	value,
	getText = t,
	onChange,
	role = 'menu',
	...otherProps
}) {
	return (
		<ul
			className={Theme.menu}
			role={role}
			{...useMenubarKeys('li')}
			{...otherProps}
		>
			{(options ?? []).map(option => {
				const val = getValue(option);

				return (
					<MenuItem
						key={getKey(option)}
						option={option}
						getText={getText}
						active={value === val}
						onClick={() => onChange(val)}
					/>
				);
			})}
		</ul>
	);
}
