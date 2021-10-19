import { useEffect } from 'react';

import { rawContent } from '@nti/lib-commons';

import { isAccessError } from './utils/is-access-error';
import { isNotFound } from './utils/is-not-found';
import { report } from './utils/report';

const isHTML = /<html|<([a-z]+)[^>]*>(.+)<\/\1>/i;

//#region Paint

const Message = styled.figcaption`
	line-height: 1em;
	color: #757575;
	font-size: 1em;
	text-align: center;

	& > div {
		white-space: pre;
		word-wrap: break-word;
		word-break: break-word;
	}
`;

const Label = styled.span`
	display: inline-block;
	color: #b22222;
	font-weight: bold;
	font-size: 1em;
	margin-bottom: 1em;
`;

const Glyph = styled('div').attrs({ className: 'm glyph icon-alert' })`
	color: #b33333;
	font-size: 5em;
	text-align: center;

	/* .m */
	margin: 0 auto;
	position: relative;
`;

const Figure = styled('figure').attrs({ className: 'error' })`
	overflow: visible;
	position: relative;

	&.inline {
		margin: 0;
		display: flex;
		flex-direction: row;
		align-items: center;

		${Glyph} {
			flex: 0 0 auto;
			font-size: 2em;
			margin: 0 0.25em 0 0;
			width: auto;
		}

		${Label}, ${Message} > div {
			display: inline;
		}

		${Label} {
			margin-bottom: 0;

			&::after {
				content: ': ';
			}
		}

		${Message} {
			flex: 1 1 auto;
			text-align: left;
			font-size: 1em;
		}
	}
`;

//#endregion

/**
 * @param {object} props
 * @param {boolean} props.inline
 * @param {Error|string} props.error
 * @param {any} props.children
 * @param {string} props.message
 * @returns {JSX.Element}
 */
export function ErrorPanel({
	inline = false,
	error,
	children,
	message = children,
}) {
	useEffect(() => {
		report(error);
	}, [error]);

	let label = 'Error';
	if (!message) {
		message =
			(typeof error !== 'string' ? '' : error) || 'Something went wrong.';
	}

	if (isHTML.test(message)) {
		message = <pre {...rawContent(message)} />;
	}

	if (isAccessError(error)) {
		label = 'Access was denied.';
		message = "We're sorry, but you do not have access to this content.";
	} else if (isNotFound(error)) {
		label = 'Not Found.';
		message = "We're sorry, but we could not find this content.";
	}

	return (
		<Figure inline={inline}>
			<Glyph />
			<Message>
				<Label>{label}</Label>
				<div>{message}</div>
			</Message>
		</Figure>
	);
}
