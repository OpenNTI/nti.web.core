/** @typedef {import('./get-flyout-props').FlyoutProps} FlyoutProps */
/** @typedef {import('./hooks/use-alignment').AlignmentProps} AlignmentProps */

/**
 * @typedef {object} FlyoutCmpProps
 * @property {boolean} [open=false] - control wether or not the flyout is open
 * @property {object} alignTo - Where to align the flyout. If there is a child of `Flyout.Trigger` you don't need to pass this.
 * @property {boolean} [autoDismissOnAction=false] - automatically dismiss the flyout when its clicked
 */

import React, {
	useState,
	useRef,
	useCallback,
	useImperativeHandle,
} from 'react';

import { useId } from '../hooks/use-id';
import { Slot } from '../layout/Slot';

import Trigger from './parts/Trigger';
import Content from './parts/Content';

/**
 * Render a flyout.
 *
 * @param {(AlignmentProps & FlyoutProps)} props
 * @param {React.Ref<FlyoutCmp>} ref
 * @returns {JSX.Element}
 */
function FlyoutCmp(
	{
		open: openProp,
		alignTo: alginToProp,
		autoDismissOnAction,

		children,

		...otherProps
	},
	ref
) {
	const id = useId('flyout');

	const [openState, setOpen] = useState(false);
	const open = openProp != null ? openProp : openState;
	const dismiss = useCallback(() => setOpen(false), [setOpen]);

	const triggerRef = useRef();
	const alignTo = alginToProp != null ? { current: alginToProp } : triggerRef;

	useImperativeHandle(ref, () => ({ dismiss }), [dismiss]);

	const slotProps = {
		[Trigger]: {
			'aria-controls': id,
			ref: triggerRef,
			open,
			setOpen,
		},
		[Content]: {
			id,
			open,
			alignTo,
			onClick: autoDismissOnAction ? dismiss : null,
			...otherProps,
		},
	};

	if (open) {
		slotProps[Trigger]['aria-expanded'] = true;
	}

	return (
		<Slot.List
			slots={[Trigger, Content]}
			map={(slot, child) => {
				const extraProps = slotProps[slot];

				return extraProps
					? React.cloneElement(child, extraProps)
					: child;
			}}
			children={children}
		/>
	);
}

export const Flyout = React.forwardRef(FlyoutCmp);

Flyout.Trigger = Trigger;
Flyout.Content = Content;
