import PropTypes from 'prop-types';
import { Suspense } from 'react';

import { useEntity } from '../hooks/use-entity';

/**
 * This component can use the full Entity instance if you have it.
 * Otherwise, it will take a username string for the entity prop.
 */

Base.propTypes = {
	entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	me: PropTypes.bool,
	children: PropTypes.func,
};

function Base({ entity, me, children, ...props }) {
	const resolved = useEntity(entity);
	return children?.({ ...props, ...resolved });
}

export function BaseEntity(props) {
	return (
		<Suspense fallback={<span />}>
			<Base {...props} />
		</Suspense>
	);
}
