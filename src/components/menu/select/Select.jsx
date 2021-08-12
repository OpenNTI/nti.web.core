import React from 'react';
import cx from 'classnames';

import { ChevronIcon } from '../../icons/Chevron';
import { Flyout } from '../../flyout/Flyout';
import { VariantGetter } from '../../../system/utils/PropGetters';

import Theme from './Select.theme.css';
import { MenuList } from './parts/MenuList';

const getVariant = VariantGetter(['header'], 'header');

const t = x => x;

const VariantToTriggerProps = {
	header: {
		size: 'header',
		variant: 'secondary',
		transparent: true,
	},
};

export function SelectMenu(props) {
	const [variant, restProps] = getVariant(props);
	const {
		getText = t,
		value,
		title = getText(value),
		options,
		onChange,

		name = 'select-menu',
	} = restProps;

	const hasOptions = !!options?.length;

	return (
		<Flyout horizontalAlign="left-or-right" autoDismissOnAction>
			<Flyout.Trigger
				variant="secondary"
				transparent
				className={cx(Theme.menuTrigger, {
					[Theme.noOptions]: !hasOptions,
				})}
				data-testid={`${name}-trigger`}
				{...(VariantToTriggerProps[variant] ?? {})}
			>
				<span>{title}</span>
				{hasOptions && <ChevronIcon.Down large />}
			</Flyout.Trigger>
			<Flyout.Content>
				<MenuList
					options={options}
					value={value}
					onChange={onChange}
					getText={getText}
				/>
			</Flyout.Content>
		</Flyout>
	);
}
