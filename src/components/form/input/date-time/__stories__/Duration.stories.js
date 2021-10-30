import { Duration } from '../Duration';

export default {
	title: 'Components/Inputs/Duration',
	components: Duration,
	argTypes: {
		onChange: { action: 'onChange' },
	},
};

export const Base = ({ onChange }) => {
	return <Duration />;
};
