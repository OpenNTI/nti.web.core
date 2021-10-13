
import { InlineList } from '../Inline';
import { Button } from '../../button/Button';

const Link = styled(Button).attrs({ plain: true })`
	color: var(--primary-blue);
`;

export default {
	title: 'Components/List/Inline',
	component: InlineList,
};

export const Base = () => (
	<InlineList>
		<span>Item 1</span>
		<span>Item 2</span>
		<span>Item 3</span>
	</InlineList>
);

export const ListOfLinks = () => (
	<InlineList>
		<Link>Item 1</Link>
		<Link>Item 2</Link>
		<Link>Item 3</Link>
	</InlineList>
);
