import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const icon = 'icon-duplicate';

function DuplicateIcon(props) {
	return <FontIcon icon={icon} {...props} />;
}

export const Duplicate = setIcon(DuplicateIcon);
