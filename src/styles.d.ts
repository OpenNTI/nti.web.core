declare module '*.css' {
	const classes: { [key: string]: string };
	export default classes;
}

import styled, { css, stylesheet } from 'astroturf/react';

export { styled, css, stylesheet };
