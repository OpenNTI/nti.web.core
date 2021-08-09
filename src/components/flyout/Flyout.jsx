import React, { useState, useRef } from 'react';

import { useId } from '../hooks/use-id';
import { Slot } from '../layout/Slot';

import Trigger from './parts/Trigger';
import Content from './parts/Content';

Flyout.Trigger = Trigger;
Flyout.Content = Content;
export default function Flyout({
	open: openProp,
	alignTo: alginToProp,
	children,

	...otherProps
}) {
	const id = useId('flyout');

	const [openState, setOpen] = useState(false);
	const open = openProp != null ? openProp : openState;

	const triggerRef = useRef();
	const alignTo = alginToProp != null ? { current: alginToProp } : triggerRef;

	const PropsByCmp = {
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
			...otherProps,
		},
	};

	if (open) {
		PropsByCmp[Trigger]['aria-expanded'] = true;
	}

	return (
		<Slot.List
			slots={[Trigger, Content]}
			map={(slot, child) => {
				const extraProps = PropsByCmp[slot];

				return extraProps
					? React.cloneElement(child, extraProps)
					: child;
			}}
			children={children}
		/>
	);
}
