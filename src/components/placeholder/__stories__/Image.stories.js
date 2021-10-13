
import { Image as ImagePlaceholder } from '../types/Image';

export default {
	title: 'Components/Placeholder/Image',
	component: ImagePlaceholder,
};

export const Base = props => <ImagePlaceholder {...props} />;
Base.argTypes = {
	flat: { control: { type: 'boolean' } },
	aspectRatio: { control: { type: 'number' } },
};

const Img = styled('img')`
	width: 200px;
	height: 200px;
`;

export const Styled = props => <ImagePlaceholder as={Img} {...props} />;
Styled.argTypes = {
	flat: { control: { type: 'boolean' } },
};
