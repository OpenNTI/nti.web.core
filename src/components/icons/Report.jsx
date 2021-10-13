
import { setIcon } from './types/identity';
import FontIcon from './types/Font-Icon';

const Icon = 'icon-report';

function ReportIcon(props) {
	return <FontIcon icon={Icon} {...props} />;
}

export const Report = setIcon(ReportIcon);
