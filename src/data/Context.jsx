import React from 'react';
import PropTypes from 'prop-types';

const Context = React.createContext({ stores: [] });

class DataContextWrapper extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		fallback: PropTypes.node,
		error: PropTypes.node,
	};

	state = {};

	componentDidCatch(error) {
		this.setState({ error });
	}

	render() {
		const { children, fallback, error } = this.props;

		if (this.state.error && error) {
			return React.cloneElement(error, { error: this.state.error });
		}

		return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
	}
}

DataContext.useContext = () => React.useContext(Context);
export default function DataContext({ store, ...otherProps }) {
	const { stores } = React.useContext(Context);
	const context = React.useMemo(
		() => ({ stores: [...stores, store] }),
		[...stores, store]
	);

	if (!store) {
		return <DataContextWrapper {...otherProps} />;
	}

	return (
		<Context.Provider value={context}>
			<DataContextWrapper {...otherProps} />
		</Context.Provider>
	);
}
