import cx from 'classnames';

import { NoticePanel } from './Panel';

/**
 *
 * @param {object} props
 * @param {any} props.children
 * @param {string=} props.header
 * @param {string=} props.subHeader
 * @param {string=} props.className
 * @returns {JSX.Element}
 */
export function EmptyState({ children, header, subHeader, className }) {
	if (children) {
		if (!header) {
			header = children;
			children = null;
		} else if (!subHeader) {
			subHeader = children;
			children = null;
		}
	}

	return (
		<NoticePanel
			className={cx('empty-state-component', className)}
			css={css`
				border: none;
				background: none;
				text-align: center;
				color: var(--tertiary-grey);

				h1 {
					font: normal 300 1.75rem/2.375rem var(--body-font-family);
					margin: 5px 0;
				}

				p {
					font: normal 400 0.875rem/1.25rem var(--body-font-family);
					margin: 0;
				}
			`}
		>
			{header && <h1>{header}</h1>}
			{subHeader && <p>{subHeader}</p>}
			{children}
		</NoticePanel>
	);
}
