
import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const icon = 'icon-reset';

function ResetIcon(props) {
	return <FontIcon icon={icon} {...props} />;
}

export const Reset = setIcon(ResetIcon);
