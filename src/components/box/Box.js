import React from 'react';

import { getSpacingProps } from '../../system/css/get-spacing-props';
import { getBorderProps } from '../../system/css/get-border-props';

export function Box({ as: Cmp = 'div', ...otherProps }) {
	return <Cmp {...getSpacingProps(getBorderProps(otherProps))} />;
}

export { Card } from './Card';
