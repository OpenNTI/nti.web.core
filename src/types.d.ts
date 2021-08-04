import * as React from 'react';

export type Props = object;

export type AsProp<T = any> = React.ComponentType<T> | string;

export type EventHandler = (e: Event) => void;

declare module '*.css' {
	const classes: { [key: string]: string };
	export default classes;
}
