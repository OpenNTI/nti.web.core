//@ts-check
import ReactDOM from 'react-dom';
import React, { useContext } from 'react';

/**
 * Since React 17+, the event system attaches to the mount point instead of
 * document root. To handle events before, or after, react does, we need to
 * know where to put _our_ event listeners if we need to monkey patch the
 * event. (for things like our editors)
 *
 * This context should be used for every `ReactDOM.render` and
 * `ReactDOM.createPortal` that hosts a component that uses the mount point.
 */
const MountPointContext = React.createContext(global.document?.body);

/**
 * Convenience method to render a component at a mount point (and simultaneously
 * setting the context)
 *
 * @param {JSX.Element} jsx
 * @param {HTMLElement} node
 * @returns {{unmount: () => void}}
 */
export function renderToMountPoint(jsx, node) {
	// eslint-disable-next-line react/no-render-return-value
	ReactDOM.render(<SetMountPoint node={node}>{jsx}</SetMountPoint>, node);

	return {
		unmount() {
			ReactDOM.unmountComponentAtNode(node);
		},
	};
}

/**
 * Convenience method to render a portaled component at a mount point (and simultaneously
 * setting the context)
 *
 * @param {JSX.Element} jsx
 * @param {HTMLElement} node
 * @returns {React.ReactPortal}
 */
export function createPortalInMountPoint(jsx, node) {
	return ReactDOM.createPortal(
		<SetMountPoint node={node}>{jsx}</SetMountPoint>,
		node
	);
}

/**
 * Simple hook to get the mount point.
 *
 * @returns {HTMLElement}
 */
export const useMountPoint = () =>
	useContext(MountPointContext) ??
	(() => {
		throw new Error('No mount point set!');
	})();

/**
 * Convenience component to supply the mount point value.
 *
 * @param {object} param0
 * @param {HTMLElement} param0.node
 * @param {React.ReactElement<any>} param0.children
 * @returns {JSX.Element}
 */
export const SetMountPoint = ({ node, ...props }) => (
	<MountPointContext.Provider {...props} value={node} />
);

/**
 * Convenience component to receive the mount point as a prop.
 *
 * @param {object} param0
 * @param {string=} [param0.prop="mountPoint"]
 * @param {React.ReactElement<any>} param0.children
 * @returns {JSX.Element}
 */
export const MountPoint = ({ prop = 'mountPoint', children }) => (
	<MountPointContext.Consumer>
		{value =>
			React.cloneElement(React.Children.only(children), { [prop]: value })
		}
	</MountPointContext.Consumer>
);

/**
 * Convenience function to use the mount point value as a high-order component.
 *
 * @template T
 * @param {React.ComponentType<T>} cmp
 * @returns {React.ForwardRefExoticComponent<React.PropsWithoutRef<T>>}
 */
export const withMountPoint = cmp =>
	React.forwardRef((props, ref) => {
		const mountPoint = useMountPoint();
		return React.createElement(cmp, { ...props, ref, mountPoint });
	});
