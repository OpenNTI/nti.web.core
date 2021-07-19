import React from 'react';

import { setIcon } from './types/identity';
import SVGIcon from './types/SVG-Icon';

const DisclosureArrowIcon = React.forwardRef(function DisclosureArrow(
	props,
	ref
) {
	return (
		<SVGIcon width="12" height="5" viewBox="0 0 12 5" {...props} ref={ref}>
			<polygon points="11.5,0 6,5 0.5,0 " />
		</SVGIcon>
	);
});

export const DisclosureArrow = setIcon(DisclosureArrowIcon);
