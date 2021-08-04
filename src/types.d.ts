import * as React from 'react';

export type Props = object;

export type AsProp<T = any> = React.ComponentType<T> | string;

export type EventHandler = (e: Event) => void;

export type Constructor = new (...args: any[]) => {};
