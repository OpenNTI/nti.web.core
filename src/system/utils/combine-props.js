import cx from 'classnames';

/**
 * Combine the classNames, styles, and others from multiple props
 *
 * @param  {...{}} propSets
 * @returns {{}}
 */
export default function combineProps(...propSets) {
	let combined = {};

	for (let props of propSets) {
		combined = { ...combined, ...props };

		if (props.className != null && combined.className != null) {
			combined.className = cx(props.className, combined.className);
		}

		if (props.style != null && combined.style != null) {
			combined.style = { ...props.style, ...combined.style };
		}
	}

	return combined;
}
