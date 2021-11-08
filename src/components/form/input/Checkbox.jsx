import React from 'react';
import cx from 'classnames';

import { getSpacingProps } from '../../../system/css/get-spacing-props';
import { VariantGetter } from '../../../system/utils/PropGetters';
import { Text } from '../../text/Text';

import Theme from './Checkbox.theme.css';
import { setInput } from './utils/identity';

const getStyleVariant = VariantGetter(['blue', 'green'], 'blue');

function CheckboxImpl(propsArg, ref) {
	const [style, props] = getStyleVariant(propsArg);

	const {
		className,
		disabled,
		label,
		name,
		['data-testid']: testId,
		...otherProps
	} = getSpacingProps(props, { p: 'md' });

	return (
		<label
			data-testid={testId}
			className={cx(Theme.checkbox, Theme[style], {
				[Theme.disabled]: disabled,
			})}
		>
			<input
				{...otherProps}
				name={name}
				disabled={disabled}
				type="checkbox"
			/>
			<Text className={cx(Theme.label)}>{label}</Text>
		</label>
	);
}

export const Checkbox = setInput(React.forwardRef(CheckboxImpl));
