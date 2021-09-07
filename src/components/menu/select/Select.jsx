import React from 'react';
import cx from 'classnames';

import { ChevronIcon } from '../../icons/Chevron';
import { Flyout } from '../../flyout/Flyout';
import { VariantGetter } from '../../../system/utils/PropGetters';

import Theme from './Select.theme.css';
import { MenuList } from './parts/MenuList';

const getVariant = VariantGetter(['header', 'medium', 'link'], 'header');

const t = x => x;

const VariantToTriggerProps = {
	header: {
		size: 'header',
		variant: 'secondary',
		transparent: true,
	},
	medium: {
		size: 'medium',
		variant: 'secondary',
		transparent: true,
	},
	link: {
		size: 'medium',
		variant: 'primary',
		transparent: true,
	},
};

export function SelectMenu(props) {
	const [variant, restProps] = getVariant(props);
	const {
		className,
		getText = t,
		value,
		title = getText(value),
		options,
		onChange,

		name = 'select-menu',
		...otherProps
	} = restProps;

	const hasOptions = !!options?.length;

	return (
		<Flyout horizontalAlign="left-or-right" autoDismissOnAction>
			<Flyout.Trigger
				variant="secondary"
				transparent
				className={cx(className, Theme.menuTrigger, {
					[Theme.noOptions]: !hasOptions,
				})}
				data-testid={`${name}-trigger`}
				{...(VariantToTriggerProps[variant] ?? {})}
				{...otherProps}
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
