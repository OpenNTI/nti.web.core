
import { setIcon } from './types/identity';
import SVGIcon from './types/SVG-Icon';

function VideoIcon(props) {
	return (
		<SVGIcon {...props} viewBox="0 0 26 19" width="1.375em">
			<g
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<g
					transform="translate(-440.000000, -424.000000)"
					stroke="currentColor"
					strokeWidth="2"
				>
					<g transform="translate(396.000000, 421.000000)">
						<g transform="translate(45.000000, 4.000000)">
							<path
								fill="#ffffff"
								d="M23.4975843,2.6610608 C23.233828,1.59882623 22.4265835,0.759932832 21.3813307,0.461836999 C19.5050645,0 12,0 12,0 C12,0 4.49493548,0 2.61866934,0.505821475 C1.57341648,0.803917308 0.766172031,1.6428107 0.502415685,2.70504528 C0.159031228,4.62447889 -0.0089367299,6.57162133 0.000623579939,8.52199224 C-0.0116165539,10.4870482 0.156362055,12.4490382 0.502415685,14.3829237 C0.792964554,15.4113427 1.59548672,16.2119692 2.61866934,16.4941785 C4.49493548,17 12,17 12,17 C12,17 19.5050645,17 21.3813307,16.4941785 C22.4265835,16.1960827 23.233828,15.3571893 23.4975843,14.2949547 C23.8383199,12.3899744 24.0062773,10.4576767 23.9993764,8.52199224 C24.0116166,6.5569363 23.8436379,4.59494627 23.4975843,2.6610608 Z"
							></path>
							<polygon points="9 12 16 8.5 9 5"></polygon>
						</g>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
}

export const Video = setIcon(VideoIcon);
