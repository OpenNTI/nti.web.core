import React, { useRef } from 'react';

const Cache = new WeakMap();

const rootMarginFromBuffer = (buffer = 0) => {
	if (typeof buffer === 'number') {
		return `${buffer}px ${buffer}px ${buffer}px ${buffer}px`;
	}

	//fill this in
};

const hasIntersectionObserver = () =>
	typeof global.IntersectionObserver !== 'undefined';

const getIntersectionObserver = (onChange, buffer) =>
	new IntersectionObserver(
		entries => {
			const entry = entries[0]; //should only ever be one;
			const onScreen = entry.isIntersecting;

			const prev = Cache.get(entry.target);

			Cache.set(entry.target, onScreen);

			if (prev == null || prev !== onScreen) {
				onChange(onScreen);
			}
		},
		{
			rootMargin: rootMarginFromBuffer(buffer),
		}
	);

const getFallbackObserver = onChange => ({
	observe: () => onChange(true),
	unobserve: () => {},
	disconnect: () => {},
});

function useIntersectionObserver(onChange, { buffer }) {
	const changeRef = useRef(null);
	const bufferRef = useRef(null);

	const observerRef = useRef(null);

	if (changeRef.current === onChange && bufferRef.current === buffer) {
		return observerRef.current;
	}

	observerRef.current?.disconnect();

	changeRef.current = onChange;
	bufferRef.current = buffer;

	observerRef.current = hasIntersectionObserver()
		? getIntersectionObserver(onChange, buffer)
		: getFallbackObserver(onChange, buffer);

	return observerRef.current;
}

export function useOnScreen(onChange, config = {}) {
	const ref = useRef();
	const observer = useIntersectionObserver(onChange, config);

	React.useEffect(() => {
		const target = ref.current;

		observer.observe(target);

		return () => observer.unobserve(target);
	}, [observer]);

	return { ref };
}
