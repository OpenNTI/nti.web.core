import { useEffect, useRef } from 'react';
import cx from 'classnames';

import {
	focusDescendantOrElement,
	addClickOutListener,
	addKeyboardBlurListener,
} from '@nti/lib-dom';

import { useLayer } from '../../../system/layers/use-layer';
import { getSpacingProps } from '../../../system/css/get-spacing-props';
import { useAlignment } from '../hooks/use-alignment';
import Theme from '../Flyout.theme.css';
import { getFlyoutProps } from '../get-flyout-props';
import { getBorderProps } from '../../../system/css/get-border-props';

import ZBooster from './ZBooster';

const OuterStyles = ['top', 'bottom', 'left', 'right', 'width'];
const InnerStyles = ['maxHeight', 'maxWidth'];

const getOuterStyles = alignment =>
	OuterStyles.reduce((acc, style) => {
		if (alignment[style] != null) {
			acc[style] = `${alignment[style]}px`;
		}

		return acc;
	}, {});

const getInnerStyles = alignment =>
	InnerStyles.reduce((acc, style) => {
		if (alignment[style] != null) {
			acc[style] = `${alignment[style]}px`;
		}

		return acc;
	}, {});

export default function FlyoutContent({
	className,
	id,
	onClickOut,
	onKeyboardBlur,
	...props
}) {
	const { alignTo } = props;
	const layer = useLayer({ level: 'top' });

	const flyoutRef = useRef();
	const alignment = useAlignment({ flyoutRef, ...props });

	useEffect(() => {
		if (!alignment.hidden) {
			const timeout = setTimeout(() => {
				focusDescendantOrElement(flyoutRef.current);
			}, 1);

			return () => clearTimeout(timeout);
		}
	}, [alignment.hidden]);

	useEffect(() => {
		if (alignment.hidden || !alignTo || !flyoutRef.current) {
			return;
		}

		const cleanupClickOut = addClickOutListener(
			flyoutRef.current,
			e => (alignTo.current?.onClickOut?.(e), onClickOut?.(e))
		);

		const cleanupKeyboardBlur = addKeyboardBlurListener(
			flyoutRef.current,
			e => (alignTo.current?.onKeyboardBlur?.(e), onKeyboardBlur?.(e))
		);

		return () => (cleanupClickOut(), cleanupKeyboardBlur());
	}, [alignment.hidden, alignTo, flyoutRef.current]);

	if (alignment.hidden) {
		return null;
	}

	const outerStyles = getOuterStyles(alignment);
	const innerStyles = getInnerStyles(alignment);

	if (outerStyles.top) {
		outerStyles['--flyout-top'] = outerStyles.top;
	}

	if (innerStyles.maxHeight) {
		innerStyles['--flyout-max-height'] = innerStyles.maxHeight;
	}

	return layer.createPortal(
		<ZBooster
			ref={flyoutRef}
			{...getFlyoutProps({
				...alignment.otherProps,
				id,
				alignment,
				'aria-expanded': 'true',
				style: {
					position: alignment.isFixed ? 'fixed' : 'absolute',
					visibility:
						!alignment || alignment.aligning ? 'hidden' : void 0,
					...outerStyles,
				},
			})}
		>
			<div className={Theme.arrow} aria-hidden="true" />
			<div
				{...getBorderProps(
					getSpacingProps(
						{
							style: innerStyles,
							className: cx(Theme.flyoutInner, className),
							...alignment.otherProps,
						},
						{ p: 'md' }
					),
					{ rounded: true }
				)}
			/>
		</ZBooster>
	);
}
