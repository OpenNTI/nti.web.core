/** @typedef {import('./hooks/use-store').StoreInstance} StoreInstance */
/** @typedef {StoreInstance} StoreInstanceList */
/** @typedef {JSX.Element} Fallback - suspense fallback */
/** @typedef {JSX.Element} Error - component to render if the error boundary trips */
/** @typedef {{store: StoreInstance, fallback: Fallback, error: Error}} DataContextProps */

import React, { Suspense, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const Context = React.createContext({ stores: [] });

class DataContextWrapper extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		fallback: PropTypes.node,
		error: PropTypes.node,
	};

	static getDerivedStateFromError(error) {
		return { error };
	}

	state = {};

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

/**
 * Get the store instance list from the current context
 *
 * @returns {StoreInstanceList}
 */
DataContext.useContext = () => useContext(Context);

/**
 * Setup a DataContext which optionally includes:
 *
 * 1. store - the data/data loader to use
 * 2. fallback - suspense placeholder to render while the stores in the context are loading
 * 3. error - component to render if a store in the context throws an error
 *
 * @param {DataContextProps} props
 * @returns {JSX.Element}
 */
export function DataContext({ store, ...otherProps }) {
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
