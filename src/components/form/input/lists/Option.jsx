import { useCallback, useEffect } from 'react';
import cx from 'classnames';

import { getSpacingProps } from '../../../../system/css/get-spacing-props';
import { getTypographyProps } from '../../../../system/css/get-typography-props';
import { useActionable } from '../../../button/hooks/use-actionable';
import { Check as CheckIcon } from '../../../icons/Check';

import Theme from './List.theme.css';
import { useListContext } from './Context';
import { setOption } from './utils/options';

export const OptionSelector = '[data-option]';

function OptionWrapper({
	className,
	children,
	selected,
	onSelect,
	value,
	...otherProps
}) {
	const onClick = useCallback(() => {
		onSelect?.(value);
	}, [value, onSelect]);

	return (
		<div
			{...getTypographyProps(
				getSpacingProps(
					{
						...otherProps,
						className: cx(className, Theme.option, {
							[Theme.selected]: selected,
						}),
						tabIndex: '0',
						...useActionable(onClick),
					},
					{ pv: 'md', pl: 'xl', pr: 'lg' }
				),
				{ type: 'body' }
			)}
		>
			{selected && <CheckIcon className={Theme.check} />}
			<span>{children}</span>
		</div>
	);
}

export function Option({ as, value, children, ...otherProps }) {
	const list = useListContext();

	if (!list) {
		throw new Error('Cannot use Option outside of a list input');
	}

	const Cmp = as ?? OptionWrapper;

	return list.simple ? (
		<option value={value}>{children}</option>
	) : (
		<Cmp
			selected={list.value === value}
			value={value}
			onSelect={list.onChange}
			data-option={true}
		>
			{children}
		</Cmp>
	);
}

setOption(Option);
