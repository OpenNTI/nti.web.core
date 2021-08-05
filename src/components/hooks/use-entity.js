import { useEffect, useReducer } from 'react';

import { User, getAppUsername } from '@nti/web-client';

import { useChanges } from '../hooks/use-changes';

const CLASSIC_STATE = (s, action) => ({ ...s, ...action });
const UNRESOLVED_NAME = 'Anonymous User';

/**
 *
 * @param {string|object} [entity = currentAppUser] - An identifier (e.g. username) or an already-resolved entity.
 * @returns {{entity: {username: string, displayName: string}, error: object}}
 */
export function useEntity(entity = getAppUsername()) {
	const userId = entity?.getID?.() || entity;
	const [state, setState] = useReducer(CLASSIC_STATE, {});

	useEffect(() => {
		let late = false;

		(async () => {
			const newState = {};
			try {
				newState.entity = await User.resolve({
					entity,
					me: entity === getAppUsername(),
				});
			} catch (e) {
				Object.assign(newState, {
					error: e,
					entity: {
						displayName: UNRESOLVED_NAME,
						username: UNRESOLVED_NAME,
						getID: () => {
							'__unresolvedUser__';
						},
					},
				});
			} finally {
				if (!late) setState(newState);
			}
		})();

		return () => {
			late = true;
		};
	}, [userId, state.generation]);

	useChanges(state.entity, () => {
		setState({ entity: null, generation: Date.now() });
	});

	return { ...state };
}
