import cx from 'classnames';

import { getSpacingProps } from '../../system/css/get-spacing-props';

import Theme from './box.theme.css';

export const getBoxProps = ({ className, ...props }) =>
	getSpacingProps({
		className: cx(className, Theme.box),
		...props,
	});
