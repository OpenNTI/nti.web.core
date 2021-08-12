import { generator } from './generator';

export const Container = generator(({ as: Cmp = 'div', ...otherProps }) => (
	<Cmp {...otherProps} />
));
