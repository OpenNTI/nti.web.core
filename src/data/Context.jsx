import React, { Suspense, useContext, useMemo } from 'react';
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

		return fallback ? (
			<Suspense fallback={fallback}>{children}</Suspense>
		) : (
			children
		);
	}
}

DataContext.useContext = () => useContext(Context);
export default function DataContext({ store, ...otherProps }) {
	const { stores } = useContext(Context);
	const context = useMemo(
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
