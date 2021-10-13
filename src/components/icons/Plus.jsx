
import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

function PlusIcon(props) {
	return <FontIcon icon="icon-add" {...props} />;
}

export const Plus = setIcon(PlusIcon);
