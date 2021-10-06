import React, { useState, useCallback, useRef, useEffect } from 'react';

import { waitForCookie, clearCookie } from '@nti/lib-dom';

import { useId } from '../hooks/use-id';

import { FormContext } from './Context';

const getAction = (action, id) => {
	const url = new URL(action, global.location.origin);

	url.searchParams.set('download-token', id);

	return url;
};

const getInputs = (params, id) => {
	let inputs = [];

	for (let [key, value] of Object.entries(params)) {
		const values = Array.isArray(value) ? value : [value];

		inputs = [
			...inputs,
			...values.map((v, i) => (
				<input type="hidden" key={`${key}.${i}`} name={key} value={v} />
			)),
		];
	}

	return inputs;
};

function DownloadFormImpl(
	{
		action,
		method = 'get',
		params = {},
		onSubmit: onSubmitProp,
		onDownloadStarted,
		onDownloadStopped,
		children,

		...otherProps
	},
	ref
) {
	const poll = useRef();
	const id = useId();

	const [generating, setGenerating] = useState(false);

	//Make sure we don't leave a poll running
	useEffect(() => {
		return () => poll.current?.stop();
	}, []);

	const onSubmit = useCallback(
		async e => {
			const cookie = `download-${id}`;

			onSubmitProp?.(e);

			try {
				setGenerating(true);

				poll.current = waitForCookie(cookie, { timeout: Infinity });
				await poll.current;

				clearCookie(cookie);
			} finally {
				setGenerating(false);

				//NOTE: for now we are just assuming that once waitForCookie finishes that
				//means that most likely the download started. In the future we can try and
				//figure out why waitForCookie finished
				onDownloadStarted?.();
			}
		},
		[id, setGenerating, onSubmitProp, onDownloadStarted, onDownloadStopped]
	);

	return (
		<>
			<FormContext submitting={generating}>
				<form
					action={getAction(action, id)}
					method={method}
					onSubmit={onSubmit}
					ref={ref}
					disabled={generating}
					{...otherProps}
				>
					{params && getInputs(params)}
					{children}
				</form>
			</FormContext>
		</>
	);
}

export const DownloadForm = React.forwardRef(DownloadFormImpl);
