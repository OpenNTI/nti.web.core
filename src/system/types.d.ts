import React from 'react';

export type AsProp<T = any> = React.ComponentType<T> | string;

export type EventHandler = (e: Event) => void;
