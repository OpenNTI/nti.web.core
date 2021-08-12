import React from 'react';

const Container = styled.ul`
	margin: 0;
	padding: 0;
	text-align: center;

	&.mask {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: rgba(255, 255, 255, 0.9);
		}
	}
`;

const Dot = styled.li`
	display: inline-block;
	width: 10px;
	height: 10px;
	padding: 0;
	background: lightgray;
	border-radius: 2px;
	opacity: 0;
	margin-right: 2px;
	will-change: opacity;
	animation: pulse 0.7s ease-in-out infinite;

	&:nth-child(3n + 1) {
		animation-delay: 0;
	}
	&:nth-child(3n + 2) {
		animation-delay: 100ms;
	}
	&:nth-child(3n + 3) {
		animation-delay: 200ms;
	}

	@keyframes pulse {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
`;

export function Ellipsis({ mask = false, ...props }) {
	return (
		<Container {...{ mask, ...props }}>
			<Dot />
			<Dot />
			<Dot />
		</Container>
	);
}
