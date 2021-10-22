import cx from 'classnames';

import { VariantGetter, PropMapper } from '../../../system/utils/PropGetters';

import Theme from './Spinner.theme.css';

const getSpinnerProps = PropMapper({
	color: VariantGetter(['current'], 'current', 'color'),
	size: VariantGetter(['small', 'large'], 'small', 'size'),
});

export function Spinner(props) {
	const {
		as: Cmp = 'div',
		color,
		size,
		className,
		...otherProps
	} = getSpinnerProps(props);

	return (
		<Cmp
			className={cx(className, Theme.spinner, Theme[color], Theme[size])}
			{...otherProps}
		>
			<svg className={Theme.circular} viewBox="25 25 50 50">
				<circle
					className={Theme.path}
					cx="50"
					cy="50"
					r="20"
					fill="none"
					strokeMiterlimit="10"
				/>
			</svg>
		</Cmp>
	);
}
