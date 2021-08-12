import React from 'react';
import cx from 'classnames';

import { VariantGetter } from '../../../system/utils/PropGetters';
import { Text } from '../../text/Text';

import Theme from './Checkbox.theme.css';

const getStyleVariant = VariantGetter(['blue', 'green'], 'blue');

function CheckboxImpl(propsArg, ref) {
	const [style, props] = getStyleVariant(propsArg);

	const { disabled, label, name, ...otherProps } = props;

	return (
		<label
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

export const Checkbox = React.forwardRef(CheckboxImpl);
