import { useState, useRef } from 'react';

import { Toast } from '../Toast';
// import { Download } from '../../icons';

export default {
	title: 'Components/Toast',
	component: Toast,
};

export const Base = () => {
	const [toasts, setToasts] = useState([]);
	const count = useRef(0);

	const addToast = layout =>
		setToasts([...toasts, { layout, key: count.current++ }]);
	const removeToast = t => setToasts(toasts.filter(i => i.key !== t.key));

	return (
		<>
			<div>
				<button onClick={() => addToast()}>Add Toast</button>
			</div>
			{toasts.map(toast => (
				<Toast
					title="Toast Title"
					key={toast.key}
					onDismiss={() => removeToast(toast)}
				>
					<span>Toast {toast.key}!</span>
				</Toast>
			))}
		</>
	);
};
