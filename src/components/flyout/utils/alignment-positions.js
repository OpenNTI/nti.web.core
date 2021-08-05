/** @typedef {(Top | Bottom | Center)} VerticalAlignments */
/** @typedef {(Left | Right | Center | LeftOrRight)} HorizontalAlignments */
/** @typedef {{top: number, left: number, bottom: number, right: number}} Position */
/** @typedef {{width: number, height: number}} Size */
/** @typedef {(Position & Size)} ClientRect */

import { Vertical, Horizontal } from './alignment-axis';
import getPseudoElementSpace from './get-psuedo-element-space';

const Top = 'top';
const Bottom = 'bottom';

const Left = 'left';
const Right = 'right';
const LeftOrRight = 'left-or-right';

const Center = 'center';
const Default = 'default';

export const ByPrimaryAxis = {
	//TODO: add horizontal positioning

	[Vertical]: {
		[Vertical]: {
			/**
			 * Align the bottom of the flyout to the top of the trigger.
			 * Use the bottom positioning to allow it to grow upwards.
			 *
			 * 		|  Flyout  |
			 * 		------------
			 * 		------------
			 * 		|  Trigger |
			 *
			 * @type {Function}
			 * @param {ClientRect} triggerRect the rect for the trigger
			 * @param {HTMLElement} flyout the flyout dom node
			 * @param {Size} viewSize the size of the viewport
			 * @returns {Position} the vertical positioning
			 */
			[Top]({ top }, flyout, { height: viewHeight }) {
				return {
					top: null,
					bottom: viewHeight - top,
				};
			},

			/**
			 * Align the top of the flyout to the bottom of the trigger.
			 * Use the top positioning to allow it to grow downwards.
			 *
			 * 		|  Trigger |
			 * 		------------
			 * 		------------
			 * 		|  Flyout  |
			 *
			 * @type {Function}
			 * @param {ClientRect} triggerRect the rect for the trigger
			 * @returns {Position} the vertical positioning
			 */
			[Bottom]({ bottom }) {
				return {
					top: bottom,
					bottom: null,
				};
			},

			/**
			 * Align the flyout to the top or bottom based on how much available space if there.
			 *
			 * If the height of the flyout will fit below the trigger, put it below.
			 * Else if the height of the flyout will fit above the trigger, put it there.
			 * Else put it to which side has the most space.
			 *
			 * @type {Function}
			 * @param {ClientRect} triggerRect the rect for the trigger
			 * @param {HTMLElement} flyout the flyout dom node
			 * @param {Size} viewSize the size of the viewport
			 * @param {{top: number, bottom: number}} reservedMargin the space to reserve between the edge of the screen
			 * @returns {Object} the vertical positioning
			 */
			[Default](
				{ top, bottom },
				flyout,
				{ height: viewHeight },
				reservedMargin
			) {
				const flyoutHeight =
					flyout.offsetHeight - getPseudoElementSpace(flyout);
				const { top: reservedTop, bottom: reservedBottom } =
					reservedMargin || {};

				const topSpace = top - (reservedTop || 0);
				const bottomSpace = viewHeight - bottom - (reservedBottom || 0);

				const bottomAlignment = ByPrimaryAxis[Vertical][Vertical][
					Bottom
				](...arguments);
				const topAlignment = ByPrimaryAxis[Vertical][Vertical][Top](
					...arguments
				);

				let position;

				if (bottomSpace >= flyoutHeight) {
					position = bottomAlignment;
				} else if (topSpace >= flyoutHeight) {
					position = topAlignment;
				} else {
					position =
						bottomSpace >= topSpace
							? bottomAlignment
							: topAlignment;
				}

				return position;
			},
		},
		[Horizontal]: {
			/**
			 * Align the left of the flyout to the left of the trigger.
			 * Use the left position so it will grow right.
			 *
			 * 		|  Trigger |
			 * 		------------
			 * 		----------------
			 * 		|  Flyout      |
			 *
			 * @type {Function}
			 * @param {ClientRect} triggerRect the rect for the trigger
			 * @returns {Position} the horizontal positioning
			 */
			[Left]({ left }) {
				return {
					left: left,
					right: null,
				};
			},

			/**
			 * Align the right of the flyout to the right of the trigger.
			 * Use the right position so it will grow left.
			 *
			 * 		    |  Trigger |
			 * 		    ------------
			 * 		----------------
			 * 		|  Flyout      |
			 *
			 * @type {Function}
			 * @param {ClientRect} triggerRect the rect for the trigger
			 * @param {HTMLElement} flyout the flyout dom node
			 * @param {Size} viewSize the size of the viewport
			 * @returns {Object} the horizontal positioning
			 */
			[Right]({ right }, flyout, { width: viewWidth }) {
				return {
					left: null,
					right: viewWidth - right,
				};
			},

			/**
			 * Align the flyout to the left or right depending on how much available space there is.
			 *
			 * If it will fit to the right, align left.
			 * Else if it will fit to the left, align right.
			 * Else align to which ever side has the most space
			 *
			 * @param {ClientRect} triggerRect
			 * @param {HTMLElement} flyout
			 * @param {Size} viewSize
			 * @returns {Position}
			 */
			[LeftOrRight](
				{ left, right },
				{ offsetWidth: flyoutWidth },
				{ width: viewWidth }
			) {
				const leftSpace = left;
				const rightSpace = viewWidth - right;

				const leftAlignment = ByPrimaryAxis[Vertical][Horizontal][Left](
					...arguments
				);
				const rightAlignment = ByPrimaryAxis[Vertical][Horizontal][
					Right
				](...arguments);

				let position;

				if (rightSpace >= flyoutWidth) {
					position = leftAlignment;
				} else if (leftSpace >= flyoutWidth) {
					position = rightAlignment;
				} else {
					position =
						leftSpace >= rightSpace
							? rightAlignment
							: leftAlignment;
				}

				return position;
			},

			/**
			 * Align the center of the flyout to the center of the trigger.
			 *
			 * 		  |  Trigger |
			 * 		  ------------
			 * 		----------------
			 * 		|  Flyout      |
			 *
			 * -OR-
			 *
			 * 		|  Trigger      |
			 * 		----------------
			 * 		  ------------
			 * 		  |  Flyout |
			 *
			 * @type {Function}
			 * @param {ClientRect} triggerRect the rect for the trigger
			 * @param {HTMLElement} flyout the flyout dom node
			 * @returns {Position} the horizontal positioning
			 */
			[Center](
				{ left, width: triggerWidth },
				{ offsetWidth: flyoutWidth }
			) {
				const triggerMid = Math.floor(triggerWidth / 2);
				const flyoutMid = Math.floor(flyoutWidth / 2);

				return {
					left: left + (triggerMid - flyoutMid),
					right: null,
				};
			},

			[Default](...args) {
				return ByPrimaryAxis[Vertical][Horizontal][Center];
			},
		},
	},
};
