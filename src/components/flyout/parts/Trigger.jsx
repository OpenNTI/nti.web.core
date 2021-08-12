/** @typedef {import('../../button/Button').ButtonProps} ButtonProps */
/**
 * @typedef {object} TriggerProps
 * @property {boolean=} hover
 */

import React, { useCallback, useImperativeHandle, useRef } from 'react';

import { Button } from '../../button/Button';

function FlyoutHoverTrigger({ open, setOpen }, ref) {}

function FlyoutToggleTrigger({ open, setOpen, ...otherProps }, ref) {
	const buttonRef = useRef();
	const onClick = useCallback(() => setOpen(!open), [open, setOpen]);

	useImperativeHandle(
		ref,
		() => ({
			getNode: () => buttonRef.current,

			onClickOut: e => {
				if (
					open &&
					e.target !== buttonRef.current &&
					!buttonRef.current.contains(e.target)
				) {
					setOpen(false);
				}
			},

			onKeyboardBlur: e => {
				if (open) {
					setOpen(false);
					buttonRef.current.focus();
				}
			},

			onFocusOutCatch: e => {
				if (open) {
					setOpen(false);
					buttonRef.current.focus();
				}
			},
		}),
		[open, setOpen]
	);

	return <Button ref={buttonRef} onClick={onClick} {...otherProps} />;
}

/**
 * A button to launch a flyout
 *
 * @param {(ButtonProps & TriggerProps)} props
 * @param {React.Ref<FlyoutTriggerSwitch>} ref
 * @returns {JSX.Element}
 */
const FlyoutTriggerSwitch = ({ hover, ...props }, ref) =>
	hover ? FlyoutHoverTrigger(props, ref) : FlyoutToggleTrigger(props, ref);

export default React.forwardRef(FlyoutTriggerSwitch);
