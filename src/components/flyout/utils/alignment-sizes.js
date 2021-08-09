/** @typedef {(MatchSize)} Sizing*/

import { Vertical } from './alignment-axis';

const MatchSize = 'match-side';
const Default = 'default';

export const SizeByAxis = {
	[Vertical]: {
		/**
		 * Match the width of the flyout to the width of the button
		 *
		 * @param {DOMRect} triggerWidth
		 * @returns {{width: number}}
		 */
		[MatchSize]({ width }) {
			return { width };
		},

		[Default]() {
			return {};
		},
	},
};
