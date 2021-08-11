import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useSharedDOM } from '../../hooks/use-shared-dom.js';
import { Square } from '../../image/SquareImg';
import { BLANK_AVATAR, BLANK_GROUP_AVATAR } from '../constants/DataURIs';
import { BaseEntity } from '../BaseEntity';

import { getAvatarProps, getColorClass } from './get-avatar-props.js';

const MASK_SPEC = `
<svg style="position:absolute;width:0;height:0">
	<defs>
		<mask id="presence-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
			<circle cx=".50" cy=".50" r=".50" fill="white" />
			<circle cx=".867" cy="0.865" r=".135" fill="black"/>
		</mask>
	</defs>
</svg>
`;

const ResolveWrapper = props => (
	<BaseEntity {...props}>{AvatarContent}</BaseEntity>
);

export const Avatar = styled(ResolveWrapper, { allowAs: true })`
	width: 40px;
	height: 40px;

	&.rounded {
		border-radius: 100%;
		object-position: center;
		object-fit: contain;
	}
`;

Avatar.propTypes = {
	...BaseEntity.propTypes,

	// fill for non-square avatars; 'none', 'src' or a canvas fillStyle compatible value.
	letterbox: PropTypes.string,

	as: PropTypes.any,

	presence: PropTypes.any,
};

Avatar.getColorClass = getColorClass;

function AvatarContent({
	entity,
	as: Component = Square,
	presence,
	letterbox = 'black',
	...props
}) {
	const [failedImage, setFailed] = useState();

	const setUnknown = () => {
		setFailed(isGroup(entity) ? BLANK_GROUP_AVATAR : BLANK_AVATAR);
	};

	const { initials, displayName } = entity || {};

	const imgSrc =
		failedImage ||
		(!entity || entity.Deactivated ? BLANK_AVATAR : entity.avatarURL);

	const childProps = getAvatarProps({
		entity,
		letterbox,
		alt: displayName && 'Avatar for ' + displayName,
		...props,
	});

	return (
		<>
			{imgSrc ? (
				<Component {...childProps} src={imgSrc} onError={setUnknown} />
			) : initials ? (
				<svg viewBox="0 0 32 32" {...childProps}>
					<rect width="100%" height="100%" />
					<text
						dominantBaseline="central"
						textAnchor="middle"
						x="50%"
						y="50%"
					>
						{initials}
					</text>
				</svg>
			) : (
				<Component
					{...childProps}
					src={isGroup(entity) ? BLANK_GROUP_AVATAR : BLANK_AVATAR}
				/>
			)}
			{presence && <AvatarMask />}
		</>
	);
}

function AvatarMask() {
	useSharedDOM(MASK_SPEC);
	return null;
}

function isGroup(entity) {
	return /\..*(friendsList|community)/i.test((entity || {}).MimeType);
}
