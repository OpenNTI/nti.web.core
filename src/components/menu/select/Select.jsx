import { Chevron } from '../../icons/Chevron';
import { Flyout } from '../../flyout/Flyout';
import { VariantGetter } from '../../../system/utils/PropGetters';
import { MenuList } from '../list/List';
import * as Option from '../list/Option';

const getVariant = VariantGetter(['header', 'medium', 'link'], 'header');

const t = x => x;

const VariantToTriggerProps = {
	header: {
		size: 'header',
		variant: 'secondary',
		transparent: true,
	},
	medium: {
		size: 'medium',
		variant: 'secondary',
		transparent: true,
	},
	link: {
		size: 'medium',
		variant: 'primary',
		transparent: true,
	},
};

export function SelectMenu(props) {
	const [variant, restProps] = getVariant(props);
	const {
		value,
		title,
		options,
		getText = t,
		onChange,

		name = 'select-menu',
		...otherProps
	} = restProps;

	const hasOptions = !!options?.length;
	const selected = value
		? (options ?? []).find(o => Option.getValue(o) === value)
		: null;

	return (
		<Flyout horizontalAlign="left-or-right" autoDismissOnAction>
			<Flyout.Trigger
				variant="secondary"
				transparent
				disabled={!hasOptions}
				data-testid={`${name}-trigger`}
				{...(VariantToTriggerProps[variant] ?? {})}
				{...otherProps}
			>
				<span>
					{title || (selected && getText(Option.getLabel(selected)))}
				</span>
				{hasOptions && <Chevron.Down large />}
			</Flyout.Trigger>
			<Flyout.Content>
				<MenuList
					options={options}
					getText={getText}
					value={value}
					onChange={onChange}
				/>
			</Flyout.Content>
		</Flyout>
	);
}
