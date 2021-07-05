/* eslint-env jest */
import { getSpacingProps } from '../get-spacing-props.js';

describe('get spacing props', () => {
	test('padding', () => {
		const props = getSpacingProps({ 'p-md': true });
		console.log(props);
	});
});
