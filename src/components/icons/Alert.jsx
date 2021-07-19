import React from 'react';

import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';
import SVGIcon from './types/SVG-Icon';

AlertIcon.Round = props => {
	return (
		<SVGIcon {...props} viewBox="0 0 40 40">
			<g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
				<g transform="translate(-411.000000, -187.000000)">
					<g transform="translate(411.000000, 187.000000)">
						<circle
							stroke="currentColor"
							strokeWidth="3"
							cx="20"
							cy="20"
							r="18.5"
						></circle>
						<text
							fontFamily="OpenSans-Bold, Open Sans"
							fontSize="25"
							fontWeight="bold"
							fill="currentColor"
						>
							<tspan x="16.4233398" y="29">
								!
							</tspan>
						</text>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
};

AlertIcon.Round.displayName = 'AlertIconRound';

function AlertIcon(props) {
	return <FontIcon icon="icon-alert" {...props} />;
}

export const Alert = setIcon(AlertIcon);
