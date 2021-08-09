/** @typedef {import('../utils/alignment-axis').Axis} Axis */
/** @typedef {import('../utils/alignment-positions').VerticalAlignments} VerticalAlignments */
/** @typedef {import('../utils/alignment-positions').HorizontalAlignments} HorizontalAlignments */
/** @typedef {import('../utils/alignment-sizes').Sizing} Sizing */

/**
 * @typedef {object} AlignmentProps
 * @property {boolean} open
 * @property {React.Ref<*>} flyoutRef
 * @property {object} alignTo
 * @property {object} parent
 * @property {Axis} [primaryAxis=Vertical]
 * @property {VerticalAlignments} verticalAlign
 * @property {HorizontalAlignments} [horizontalAlign='center']
 * @property {Sizing} sizing
 * @property {boolean} constrain
 * @property {{top: number, bottom: number}} reservedMargin
 */

/**
 * @typedef {object} Alignment
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 * @property {number} width
 * @property {number} maxWidth
 * @property {number} maxHeight
 * @property {boolean} isFixed
 * @property {object} otherProps
 */
import React, { useState, useRef } from 'react';

import { Vertical } from '../utils/alignment-axis';
import { getAlignmentInfo } from '../utils/get-alignment-info';
import { PositionByAxis } from '../utils/alignment-positions';
import { SizeByAxis } from '../utils/alignment-sizes';
import { constrainAlignment } from '../utils/constrain-alignment';
import { getViewportRelativeAlignments } from '../utils/get-viewport-relative-alignments';
import getPseudoElementSpace from '../utils/get-psuedo-element-space';

const resolveAlignTo = ref => ref.current?.getNode?.() ?? ref.current;

/**
 *
 * @param {AlignmentProps} alignment
 * @returns {Alignment}
 */
export function useAlignment({
	open,

	flyoutRef,
	alignTo,
	parent,

	primaryAxis = Vertical,
	verticalAlign,
	horizontalAlign = 'center',

	sizing,
	constrain,
	reservedMargin,

	...otherProps
}) {
	const [alignment, setAlignment] = useState({ hidden: true });

	//#region Aligning
	const align = () => {
		//If we don't have an alignTo or a flyout clear the previous alignment and hide
		if (!alignTo || !flyoutRef.current) {
			setAlignment({ hidden: true });
			return;
		}

		const alignToNode = resolveAlignTo(alignTo);
		const { alignToRect, coordinateRoot, isFixed } = getAlignmentInfo(
			alignToNode,
			parent
		);

		const layoutArgs = [
			alignToRect,
			flyoutRef.current,
			coordinateRoot,
			reservedMargin,
		];

		const positions = PositionByAxis[primaryAxis];
		const sizings = SizeByAxis[primaryAxis];

		let newAlignment = {
			...positions.vertical[verticalAlign || 'default'](...layoutArgs),
			...positions.horizontal[horizontalAlign || 'default'](
				...layoutArgs
			),

			...sizings[sizing || 'default'](...layoutArgs),

			alignTo: alignToNode,
			isFixed,

			primaryAxis,
			verticalAlign,
			horizontalAlign,
		};

		if (constrain) {
			const rect = getViewportRelativeAlignments(
				alignTo,
				newAlignment,
				coordinateRoot
			);

			const { maxWidth, maxHeight } = constrainAlignment(
				rect,
				coordinateRoot
			);

			newAlignment = { ...newAlignment, maxWidth, maxHeight };

			//If the flyout is not going to be positioned fixed, let the flyout
			//freely size vertically (only when growing down... for growing upward,
			//we will continue to limit its height)
			if (!isFixed && newAlignment.top != null) {
				delete newAlignment.maxHeight;
			}
		}

		setAlignment(newAlignment);
	};

	React.useEffect(() => {
		//if we are in the aligning state, go ahead and align...
		if (alignment.aligning) {
			align();
		}
	}, [alignment.aligning]);

	const realignTimeout = useRef();
	const realign = () => {
		cancelAnimationFrame(realignTimeout.current);
		realignTimeout.current = requestAnimationFrame(() => {
			//just move to the aligning state, the above effect will trigger the new alignment.
			setAlignment({ aligning: true });
		});
	};
	//#endregion

	//#region Flyout Size Monitor
	const flyoutSizeRef = useRef();
	//This effect will run every render to see if the flyout has changed size
	React.useEffect(() => {
		if (!open || alignment.aligning || !flyoutRef?.current) {
			return;
		}

		const prev = flyoutSizeRef.current;

		flyoutSizeRef.current = {
			width: flyoutRef.current.offsetWidth,
			height:
				flyoutRef.current.offsetHeight -
				getPseudoElementSpace(flyoutRef.current),
		};

		if (
			prev &&
			(prev.width !== flyoutSizeRef.current.width ||
				prev.height !== flyoutSizeRef.current.height)
		) {
			this.realign();
		}
	});
	//#endregion

	//#region Open Shut
	React.useEffect(() => {
		if (!open && !alignment.hidden) {
			setAlignment({ hidden: true });
		} else if (open && alignment.hidden) {
			realign();
		} else if (resolveAlignTo(alignTo) !== alignment.alignTo && open) {
			realign();
		}
	}, [open, alignTo]);
	//#endregion

	//#region Listeners
	React.useEffect(() => {
		if (!open) {
			return;
		}

		const listener = () => this.realign();

		document.addEventListener('scroll', listener, {
			passive: true,
			capture: true,
		});
		window.addEventListener('resize', listener);

		return () => {
			document.removeEventListener('scroll', listener, {
				passive: true,
				capture: true,
			});
			window.removeEventListener('resize', listener);
		};
	}, [open]);
	//#endregion

	return { ...alignment, otherProps };
}
