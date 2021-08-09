import React, { useCallback, useImperativeHandle, useRef } from 'react';

import Button from '../../button/Button';

function FlyoutHoverTrigger({ open, setOpen }, ref) {}

function FlyoutToggleTrigger({ open, setOpen, ...otherProps }, ref) {
	const buttonRef = useRef();
	const onClick = useCallback(() => setOpen(!open), [open, setOpen]);

	useImperativeHandle(
		ref,
		() => ({
			getNode: () => buttonRef.current,

			contentClickOutListener: e => {
				if (
					open &&
					e.target !== buttonRef.current &&
					!buttonRef.current.contains(e.target)
				) {
					setOpen(false);
				}
			},

			contentKeyboardBlur: e => {
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

const FlyoutTriggerSwitch = ({ hover, ...props }, ref) =>
	hover ? FlyoutHoverTrigger(props, ref) : FlyoutToggleTrigger(props, ref);

export default React.forwardRef(FlyoutTriggerSwitch);
