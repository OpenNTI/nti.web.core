import linkifyIt from 'linkify-it';

const linkifyUtil = linkifyIt();
const URL_PUNCTUATION_REGEX = /([./])/g;

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr#Example
const insertWBR = linkText =>
	linkText.replace(URL_PUNCTUATION_REGEX, '<wbr />$1');

export function linkify(text) {
	const links = linkifyUtil.match(text);

	if (!links || !links.length) {
		return { hasLinks: false, text };
	}

	let processed = '';
	let pointer = 0;

	for (let link of links) {
		const { index, lastIndex, url, text: linkText } = link;
		const pre = escape(text.substring(pointer, index));

		processed += `${pre}<a href="${url}" title="${linkText}">${insertWBR(
			linkText
		)}</a>`;
		pointer = lastIndex;
	}

	processed += escape(text.substring(pointer, text.length));

	return {
		isMarkup: true,
		hasLinks: true,
		text: processed,
	};
}

export function escape(text) {
	const span = document.createElement('span');
	span.appendChild(document.createTextNode(text));
	return span.innerHTML;
}
