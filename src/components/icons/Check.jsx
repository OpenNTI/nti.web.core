
import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const icon = 'icon-check';

function CheckIcon(props) {
	return <FontIcon icon={icon} {...props} />;
}

export const Check = setIcon(CheckIcon);
