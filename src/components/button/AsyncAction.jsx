// @ts-check
import React, { useState } from 'react';
import cx from 'classnames';

import { wait } from '@nti/lib-commons';

import { Ellipsis } from '../loading-indicators/Ellipsis';

import { Button } from './Button';
import {
	useExecutor,
	DISABLED,
	HIDE,
	NORMAL,
	PROCESSING,
	FINISHED,
	FINISHED_ERROR,
} from './hooks/use-executor';

//#region Structural Styles
/** @type {React.FunctionComponent<React.LiHTMLAttributes & {processing?: boolean}>} (Layer) */
const Layer = styled.li`
	flex: 0 0 100%;
	overflow: hidden;
	margin: 0;
	padding: 0;
	position: relative;
	border-radius: inherit;
	transition: background-color 250ms ease-in;
	width: 100%;

	& > span {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		width: max-content;
	}

	&.processing {
		& > * {
			align-items: center;
			display: flex;
			flex: 1 1 auto;
		}
	}
`;

const Group = styled.ul`
	border-radius: inherit;
	list-style-type: none;
	font-size: inherit;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	transition: top 0.25s ease-in;

	&,
	${Layer} {
		display: flex;
		align-content: center;
		align-items: center;
		flex-direction: column;
	}
`;

const Sizer = styled.span`
	visibility: hidden;
`;

const Structure = styled.button`
	position: relative;

	&.async-state-disable {
		opacity: 0.5;
		pointer-events: none;
	}

	&.async-state-hide {
		visibility: hidden;
		pointer-events: none;
	}

	&.async-state-processing ${Group} {
		pointer-events: none;
		transform: translate3d(0, -100%, 0);
		transition: transform 0.25s ease-in;
	}

	&.async-state-finished ${Group}, &.async-state-finished-error ${Group} {
		pointer-events: none;
		transform: translate3d(0, -200%, 0);
		transition: transform 0.25s ease-in;
	}

	&.async-state-finished-error ${Layer} {
		pointer-events: none;
		background-color: var(--primary-red);
	}
`;

const Mask = styled.div`
	clip: rect(0 auto auto 0);
	inset: 0;
	position: absolute;
	border-radius: inherit;
`;
//#endregion

/** @typedef {import('../../types').AsProp} AsProp */
/** @typedef {import('./hooks/use-executor').AsyncState} AsyncState */
/**
 * Renders a clickable target that will show a busy indicator on activation. The click handler must return a promise.
 *
 * @param {Object} props
 * @param {AsProp} [props.as=Button] Order matters for buttons. This should render as = Button. Not Button as AsyncAction. (onClick composition matters)
 * @param {any} props.children
 * @param {import('./hooks/use-executor').AsyncHandler} props.onClick
 * @param {string=} props.className
 * @param {boolean?} props.disabled
 * @param {AsyncState} [props.initialState=NORMAL]
 * @param {(State: AsyncState) => JSX.Element} props.renderFinalState
 * @returns {JSX.Element}
 */
export function AsyncAction({
	children: label,
	onClick,
	className,
	initialState,
	renderFinalState,
	...props
}) {
	/** @type {[AsyncState, (state: AsyncState) => void]} */
	const [status, setStatus] = useState(initialState);
	const go = useExecutor(setStatus, onClick);

	const final = renderFinalState?.(status) ?? (
		<i
			className={status !== FINISHED_ERROR ? 'icon-check' : 'icon-bold-x'}
		/>
	);

	return (
		<Structure
			{...props}
			className={cx('async-action', status, className)}
			onClick={!props.disabled && status === NORMAL ? go : void 0}
			asyncState={status}
			disabled={status === DISABLED || props.disabled}
		>
			<Sizer>
				<span>{label}</span>
			</Sizer>
			<Mask>
				<Group>
					<Layer>
						<span>{label}</span>
					</Layer>

					<Layer processing>
						<Ellipsis />
					</Layer>

					<Layer>
						<span>{final}</span>
					</Layer>
				</Group>
			</Mask>
		</Structure>
	);
}

AsyncAction.states = {
	DISABLED,
	HIDE,
	NORMAL,
	PROCESSING,
	FINISHED,
	FINISHED_ERROR,
};

AsyncAction.defaultProps = {
	as: Button,
	initialState: NORMAL,
	onClick: () => wait(2000),
};
