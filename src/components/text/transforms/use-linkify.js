import { linkify } from './utils';

export default function useLinkify(ref, props) {
	if (!props.linkify || props.isMarkup) return props;

	return { ...props, ...linkify(props.text) };
}
