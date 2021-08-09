import { useRef } from 'react';
import cx from 'classnames';

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

export default function FlyoutContent({ className, id, ...props }) {
	const layer = useLayer({ level: 'top' });

	const flyoutRef = useRef();
	const alignment = useAlignment({ flyoutRef, ...props });

	if (alignment.hidden) {
		return null;
	}

	const { className: flyoutClass } = getFlyoutProps({ alignment, ...props });

	const outerStyles = getOuterStyles(alignment);
	const innerStyles = getInnerStyles(alignment);

	return layer.createPortal(
		<ZBooster
			className={flyoutClass}
			id={id}
			ref={flyoutRef}
			aria-expanded="true"
			style={{
				position: alignment.isFixed ? 'fixed' : 'absolute',
				visibility:
					!alignment || alignment.aligning ? 'hidden' : void 0,
				...outerStyles,
				'--flyout-top': outerStyles.top,
			}}
		>
			<div className={Theme.arrow} aria-hidden="true" />
			<div
				{...getBorderProps(
					getSpacingProps({
						style: innerStyles,
						className: cx(Theme.flyoutInner, className),
						...alignment.otherProps,
					}),
					{ rounded: true }
				)}
			/>
		</ZBooster>
	);
}
