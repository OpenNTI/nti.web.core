import cx from 'classnames';

import { getTypographyProps } from '../../../../system/css/get-typography-props';
import { getSpacingProps } from '../../../../system/css/get-spacing-props';
import { useActionable } from '../../../button/hooks/use-actionable';
import { Check as CheckIcon } from '../../../icons/Check';
import Theme from '../Select.theme.css';
import { useMenubarKeys } from '../../hooks/use-menubar-keys';

function MenuItem({ option, getText, active, onClick }) {
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
			data-option={option}
		>
			{active && <CheckIcon className={Theme.check} />}
			<span>{getText(option)}</span>
		</li>
	);
}

export function MenuList({ options, value, getText, onChange }) {
	return (
		<ul className={Theme.menu} role="menu" {...useMenubarKeys('li')}>
			{options.map(option => (
				<MenuItem
					key={option}
					option={option}
					getText={getText}
					active={option === value}
					onClick={() => onChange(option)}
				/>
			))}
		</ul>
	);
}
