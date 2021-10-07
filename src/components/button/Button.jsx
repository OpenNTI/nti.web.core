// @ts-check
/** @typedef {import('../../types').EventHandler} EventHandler */
/** @typedef {import('../../types').AsProp} AsProp */
/** @typedef {import('./get-button-props').ButtonStyleProps} ButtonStyleProps */

/**
 * @typedef {object} ButtonCmpProps
 * @property {AsProp=} as - Cmp to render the button as. Defaults to a <button> or an <a> if href is given.
 * @property {boolean=} disabled - disallow triggering the button
 * @property {boolean=} busy - indicate that the button's action has been triggered
 * @property {string=} href - Link url
 * @property {EventHandler=} onClick - callback when the button is triggered
 */

/** @typedef {(ButtonCmpProps & ButtonStyleProps)} ButtonProps */

import React from 'react';

import * as Icons from '../icons';
import { filterProps } from '../utils/filter-props';

import { getButtonStyleProps } from './get-button-props';
import { useActionable } from './hooks/use-actionable';

// We need a block element within the button to counter-act the descender space...
// AsyncAction can use this to move the label
export const ButtonLabel = ({ children }) => {
	const [child, ...other] = React.Children.toArray(children);

	return other.length === 0 &&
		typeof child === 'object' &&
		'type' in child &&
		child?.type === 'div' ? (
		React.cloneElement(child, { 'data-button-label': true })
	) : (
		<div data-button-label>{children}</div>
	);
};

/**
 * Render a button
 *
 * @param {ButtonProps} props
 * @param {React.Ref<any>} ref
 * @returns {JSX.Element}
 */
function ButtonImpl(
	{
		as,
		disabled,
		busy,

		onClick,
		children: _children,

		...otherProps
	},
	ref
) {
	const Cmp = as ?? (otherProps.href ? 'a' : 'button');

	const { children, ...extraProps } =
		filterChildrenForLocalizedIcon(_children);

	return (
		<Cmp
			ref={ref}
			tabIndex={0}
			{...filterProps(
				getButtonStyleProps({
					disabled,
					busy,
					...otherProps,
					...extraProps,
				}),
				Cmp
			)}
			{...useActionable(onClick, { disabled: disabled || busy })}
		>
			{hasLabel(children) ? (
				children
			) : (
				<ButtonLabel>{children}</ButtonLabel>
			)}
		</Cmp>
	);
}

export const Button = React.forwardRef(ButtonImpl);

function hasLabel(children) {
	for (let child of React.Children.toArray(children)) {
		if (typeof child !== 'object') continue;
		if (
			('type' in child && child?.type === ButtonLabel) ||
			('children' in child && hasLabel(child.children))
		) {
			return true;
		}
	}
	return false;
}

/**
 * NTI-11289 - The commons button that this Core Button is based on grew the ability
 * to turn a localized string into a named icon for some very reused buttons that hard
 * coded some unfortunate assumptions about the label...
 *
 * Instead of untangle all that reuse, it was simpler and faster to add this capability
 * to the button. :| I'm not proud of this, but its not the nastiest thing we've done. (I'm sorry)
 *
 * @param {any} children
 * @returns {{children: any, title?: string, 'data-tooltip'?: string}}
 */
function filterChildrenForLocalizedIcon(children) {
	const extras = {};

	if (React.Children.count(children) === 1) {
		const [child] = React.Children.toArray(children);
		if (typeof child === 'string') {
			const iconRe = /^icon:([^|]+)(?:\|(.*)?)?/i;
			let [, icon, tip] = iconRe.exec(child) || [];
			if (tip) {
				extras.title = tip;
				extras['data-tooltip'] = tip;
			}

			if (icon) {
				const IconGlyph = Icons[icon];
				if (IconGlyph) {
					children = (
						<>
							<IconGlyph icon="true" />
							<span
								icon-label="true"
								css={css`
									display: none;
								`}
							>
								{tip}
							</span>
						</>
					);
				} else {
					children = <i data-icon="missing">[{icon}]</i>;
				}
			}
		}
	}

	return { children, ...extras };
}
