import React from 'react';

import { Text as TextPlaceholder } from '../types/Text';

export default {
	title: 'Components/Placeholder/Text',
	component: TextPlaceholder,
};

export const Base = props => <TextPlaceholder {...props} />;
Base.argTypes = {
	flat: { control: { type: 'boolean' } },
	text: { control: { type: 'text' } },
};

const Text = styled('span')`
	font-size: 1.25rem;
	line-height: 1.3;
`;

export const Styled = props => <TextPlaceholder as={Text} {...props} />;
Styled.argTypes = {
	flat: { control: { type: 'boolean' } },
	text: { control: { type: 'text' } },
};
