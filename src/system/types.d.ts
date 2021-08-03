import React from 'react';

export interface Props {
	[key: string]: any;
}

export type AsProp<T = any> = React.ComponentType<T> | string;

export type EventHandler = (e: Event) => void;
