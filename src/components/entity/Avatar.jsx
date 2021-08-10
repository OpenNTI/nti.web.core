import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { useSharedDOM } from '../hooks/use-shared-dom.js';
import { filterProps } from '../utils/filter-props.js';
import { Square } from '../image/SquareImg';

import { BLANK_AVATAR, BLANK_GROUP_AVATAR } from './constants/DataURIs';
import { BaseEntity } from './BaseEntity';
// import styles from './Avatar.css';

const styles = stylesheet`
svg.avatar {
	rect {
		fill: var(--tertiary-grey);
	}

	/* border-radius: 5px; */
	text {
		fill: white;
		font-weight: 700; /* font-weight: 600; */
		font-size: 10pt; /* font-size: 9pt; */
		font-family: Tahoma, Arial, sans-serif; /* font-family: var(--body-font-family); */
		text-transform: uppercase;
		-webkit-font-smoothing: subpixel-antialiased;
	}

	&.with-presence {
		& rect,
		& image {
			mask: url(#presence-mask);
		}
	}

	&:global(.avatar-color-1) rect {
		fill: #5e35b1;
	}
	&:global(.avatar-color-2) rect {
		fill: #3949ab;
	}
	&:global(.avatar-color-3) rect {
		fill: #1e88e5;
	}
	&:global(.avatar-color-4) rect {
		fill: #039be5;
	}
	&:global(.avatar-color-5) rect {
		fill: #00acc1;
	}
	&:global(.avatar-color-6) rect {
		fill: #00897b;
	}
	&:global(.avatar-color-7) rect {
		fill: #43a047;
	}
	&:global(.avatar-color-8) rect {
		fill: #7cb342;
	}
	&:global(.avatar-color-9) rect {
		fill: #c0ca33;
	}
	&:global(.avatar-color-10) rect {
		fill: #fdd835;
	}
	&:global(.avatar-color-11) rect {
		fill: #ffb300;
	}
	&:global(.avatar-color-12) rect {
		fill: #fb8c00;
	}
	&:global(.avatar-color-13) rect {
		fill: #f4511e;
	}
}
`;

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
	className,
	presence,
	letterbox = 'black',
	...props
}) {
	const [failedImage, setFailed] = useState();

	const setUnknown = () => {
		setFailed(isGroup(entity) ? BLANK_GROUP_AVATAR : BLANK_AVATAR);
	};

	const color = getColorClass(entity);
	const { initials, displayName } = entity || {};

	const imgSrc =
		failedImage ||
		(!entity || entity.Deactivated ? BLANK_AVATAR : entity.avatarURL);

	const renderer = imgSrc || !initials ? Component : 'svg';

	const childProps = {
		...filterProps(props, renderer),
		letterbox,
		alt: displayName && 'Avatar for ' + displayName,
		className: cx(styles.avatar, 'avatar', color, className, {
			[styles.withPresence]: presence,
		}),
	};

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

function getColorClass(entity) {
	function hash(str) {
		let h = 0,
			c;
		if (str.length === 0) {
			return h;
		}

		for (let i = 0; i < str.length; i++) {
			c = str.charCodeAt(i);
			h = (h << 5) - h + c;
			h = h & h; // Convert to 32bit integer
		}
		return h;
	}

	const NUM_COLORS = 12;

	let hashedString =
		(typeof entity === 'string' ? entity : entity?.Username) || 'unknown';

	let idx = Math.abs(hash(hashedString)) % NUM_COLORS;

	return `avatar-color-${idx}`;
}
