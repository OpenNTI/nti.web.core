/** @typedef {import('../utils/alignment-axis').Axis} Axis */
/** @typedef {import('../utils/alignment-positions').VerticalAlignments} VerticalAlignments */
/** @typedef {import('../utils/alignment-positions').HorizontalAlignments} HorizontalAlignments */
/** @typedef {import('../utils/alignment-sizes').Sizing} Sizing */

/**
 * @typedef {object} AlignmentProps
 * @property {boolean} open - manually control if the flyout is open or closed
 * @property {object} alignTo - what to align the flyout too, not needed if you use `Flyout.Trigger`
 * @property {object} parent - container to compute the alignments against
 * @property {Axis} [primaryAxis=Vertical] - drives which axis of alignTo the flyout will appear. vertical=above/below, horizontal=left/right
 * @property {VerticalAlignments} verticalAlign - how to align in the vertical axis
 * @property {HorizontalAlignments} [horizontalAlign='center'] - how to align in the horizontal axis
 * @property {Sizing} sizing - how to size the flyout
 * @property {boolean} constrain - do not allow the flyout to be positioned outside the screen
 * @property {{top: number, bottom: number}} reservedMargin - how much of a gap to leave when constrained
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
import React, { useState, useRef, useEffect } from 'react';

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
 * @param {(AlignmentProps & {flyoutRef: React.Ref<*>})} alignment
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

	useEffect(() => {
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
	useEffect(() => {
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
			realign();
		}
	});
	//#endregion

	//#region Open Shut
	useEffect(() => {
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
	//listen for scroll and resize to re-compute the alignment
	useEffect(() => {
		if (!open) {
			return;
		}

		const listener = () => realign();

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
