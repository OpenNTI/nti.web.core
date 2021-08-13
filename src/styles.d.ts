/* eslint-disable no-unused-vars */
declare module '*.css' {
	const classes: { [key: string]: string };
	export default classes;
}

import _styled from 'astroturf/react';
import { css as _css, stylesheet as _stylesheet } from 'astroturf';
declare global {
	//@ts-ignore
	const styled = _styled;
	//@ts-ignore
	const css = _css;
	//@ts-ignore
	const stylesheet = _stylesheet;
}
