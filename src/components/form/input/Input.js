import { Text } from '../../text/Text';
import { Variant } from '../../high-order/Variant';

import Theme from './Input.theme.css';

export { Checkbox } from './Checkbox';
export { ListBox } from './lists/ListBox';
export const Placeholder = Variant(Text, { className: Theme.placeholder });
export { Select } from './lists/Select';
export { Text } from './Text';

export { getInputStyleProps } from './get-input-props';
