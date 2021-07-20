import React, { useCallback } from 'react';
import cx from 'classnames';

import { Events } from '@nti/lib-commons';

import { getSpacingProps } from '../system/css/get-spacing-props';

const StyledButton = styled('a')`
	@import '../system/css/Color.css';

	font: normal 600 0.875rem/1rem var(--body-font-family);
	text-decoration: none;
	display: inline-flex;
	padding: 0.75rem 1.25rem;
	cursor: pointer;

	&.primary {
		background: var(--action-primary);
	}

	&.secondary {
		background: var(--action-secondary);
	}

	&.destructive {
		background: var(--action-destructive);
	}

	&.constructive {
		background: var(--action-constructive);
	}
`;

function Button(
	{
		children,
		className,

		disabled,
		onClick,

		rounded,

		plain,
		primary,
		secondary,
		destructive,
		constructive,
		inverted,

		...otherProps
	},
	ref
) {
	const { className: spacingClass } = getSpacingProps(otherProps, {
		pv: 'md',
		ph: 'lg',
	});

	const Cmp = plain ? 'a' : StyledButton;

	const trigger = useCallback(
		e => {
			// This handler is called for clicks and keydown.
			// This filter only allows "clicks" from physical clicks and "keydown" events from Space or Enter.
			if (disabled || !Events.isActionable(e)) {
				if (disabled) {
					e.preventDefault();
					e.stopPropagation();
				}

				onClick?.(e);
			}
		},
		[disabled, onClick]
	);

	const state = {
		primary: primary || (!secondary && !destructive && !constructive),
		secondary,
		destructive,
		constructive,

		inverted,
		disabled,
		rounded,
	};

	return (
		<Cmp
			className={cx(className, spacingClass)}
			role="button"
			tabIndex="0"
			onClick={trigger}
			{...state}
			{...otherProps}
		>
			{children}
		</Cmp>
	);
}

export default React.forwardRef(Button);
