
import { setIcon } from './types/identity';
import SVGIcon from './types/SVG-Icon';

//https://icons.getbootstrap.com/icons/paperclip/

function PaperClipIcon(props) {
	return (
		<SVGIcon {...props} width="1.5em">
			<path
				fillRule="evenodd"
				d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"
			/>
		</SVGIcon>
	);
}

export const PaperClip = setIcon(PaperClipIcon);
