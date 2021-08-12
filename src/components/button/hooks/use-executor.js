// @ts-check
import { useCallback, useEffect } from 'react';

import { wait } from '@nti/lib-commons';

export const DISABLED = 'disabled';
export const HIDE = 'hide';
export const NORMAL = 'normal';
export const PROCESSING = 'processing';
export const FINISHED = 'finished';
export const FINISHED_ERROR = 'finished-error';

const RESET_DELAY = 1000; //milliseconds
const MIN_DELAY_BEFORE_FINISHING = 1000; // milliseconds

/** @typedef {DISABLED|HIDE|NORMAL|PROCESSING|FINISHED|FINISHED_ERROR} AsyncState */
/** @typedef {() => void} Selection */
/** @typedef {(arg: boolean|Error) => void} FinalizeCallback */

/**
 * @typedef {object} FinalStateSelection
 * @property {Selection} disable - Set final state to be a disabled button
 * @property {Selection} hide - Set final state to be hidden
 * @property {Selection} reset - Set final state to reset to initial state
 * @property {Selection} retain - Do not change state after async resolution
 * @property {(fn: FinalizeCallback) => void} call - Call function on final state after async resolution
 */
/** @typedef {(buttonTransition:Promise<unknown>, finalStateSelection: FinalStateSelection) => Promise<any>} AsyncHandler */

/**
 * Primary implementation of AsyncAction
 *
 * @param {(state: AsyncState) => void} set
 * @param {AsyncHandler} onClick
 * @returns {(e: Event) => void}
 */
export function useExecutor(set, onClick) {
	let resetTimer;
	let cancelArtificialDelay;

	const handler = useCallback(
		async e => {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}

			/** @type {AsyncState|FinalizeCallback|null} */
			let reset = NORMAL;
			let done;
			let error = false;
			let work = new Promise(f => (done = f));

			const selectFinalState = {
				disable: () => (reset = DISABLED),
				hide: () => (reset = HIDE),
				reset: () => (reset = NORMAL),
				retain: () => (reset = null),
				call: (/** @type {FinalizeCallback} */ fn) => (reset = fn),
			};
			// Ensure the react component has redrawn. (using setState's callback)
			set(PROCESSING);
			const ensureDelay = wait.min(MIN_DELAY_BEFORE_FINISHING);
			cancelArtificialDelay = ensureDelay.cancel;

			try {
				await onClick?.(work, selectFinalState);
				await ensureDelay();
				// Once the onClick task has been completed, set the state to finished
				set(FINISHED);
			} catch (e) {
				if (e === 'canceled') {
					set(NORMAL);
					return;
				}

				error = e;
				// The onClick function should still handle its own errors, it can opt
				// to ALSO throw the error to make this caller aware as to show an error state.
				set(FINISHED_ERROR);
				reset = NORMAL;
			}

			// Schedule the reset. If the component is unmounted before the reset,
			// the cleanup hook will cancel the timer.

			resetTimer = setTimeout(() => {
				if (typeof reset === 'string') {
					set(reset);
				}
				done();
				if (typeof reset === 'function') {
					reset(error);
				}
			}, RESET_DELAY);
		},
		[set, onClick]
	);

	useEffect(
		// register a cleanup callback
		() =>
			// The effect hook function needs to return a function
			() => {
				//clearTimeout is safe to call on any value.
				clearTimeout(resetTimer);
				cancelArtificialDelay?.();
			},
		[set, onClick]
	);

	useEffect(
		// register a cleanup callback
		() =>
			// The effect hook function needs to return a function
			() => {
				set = () => null;
			},
		[]
	);

	return handler;
}
