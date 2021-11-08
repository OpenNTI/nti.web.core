import { getCombinedStyleProps } from '../get-input-props';

export function Combined({ as: Cmp = 'fieldset', ...otherProps }) {
	return <Cmp {...getCombinedStyleProps(otherProps)} />;
}
