import React, { useCallback } from 'react';
import cx from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Theme from '../Toast.theme.css';
import { Top, TopRight } from '../Locations';
import { useResize } from '../../hooks/use-resize-observer';
import { ZBooster } from '../../../system/layers/ZBooster';

const RegionOrder = [Top, TopRight];

const DefaultLocation = TopRight;

const LocationToTransition = {
	[Top]: {
		enter: Theme.enterTop,
		enterActive: Theme.enterTopActive,
		exit: Theme.exitTop,
		exitActive: Theme.exitTopActive,
		appear: Theme.appearTop,
		appearActive: Theme.appearTopActive,
	},
	[TopRight]: Top,
};

const getLocationClass = l => Theme[l.toLowerCase()];
const getTransitionClassName = l => {
	const transition = LocationToTransition[l];

	return LocationToTransition[transition] ?? transition;
};

const ToastWrapper = ({ toast }) => {
	const updateKnownHeight = useCallback(
		node =>
			node?.style?.setProperty(
				'--known-height',
				`${node.clientHeight}px`
			),
		[]
	);

	return (
		<li {...useResize(updateKnownHeight)} data-toast-id={toast.id}>
			{toast.contents}
		</li>
	);
};

const Region = ({ toasts, location }) => (
	<TransitionGroup
		component="ul"
		className={cx(Theme.region, getLocationClass(location))}
	>
		{toasts.map(toast => (
			<CSSTransition
				key={toast.id}
				classNames={getTransitionClassName(location)}
				timeout={200}
				appear
			>
				<ToastWrapper toast={toast} timeout={200} />
			</CSSTransition>
		))}
	</TransitionGroup>
);

export function Container({ toasts, global, location: locationOverride }) {
	const regions = toasts.reduce((acc, toast) => {
		const location = locationOverride ?? toast.location ?? DefaultLocation;

		if (!acc[location]) {
			acc[location] = [];
		}

		acc[location].push(toast);

		return acc;
	}, {});

	return (
		<ZBooster
			data-toast-container="yes"
			className={cx(Theme.container, { [Theme.global]: global })}
		>
			{RegionOrder.map(name => {
				if (!regions[name] || !regions[name].length) {
					return null;
				}

				return (
					<Region key={name} location={name} toasts={regions[name]} />
				);
			})}
		</ZBooster>
	);
}
