import EventEmitter from 'events';

import { VisibilityMonitor } from '@nti/lib-dom';

const Tick = 'tick';
const Interval = 1000;

const safeCall = (fn, args) => {
	try {
		fn(...args);
	} catch (e) {
		//swallow
	}
};

class SystemClock extends EventEmitter {
	#state = {};

	subscribeToTicks(fn, { frequency, interval }) {
		const subscribed = new Date();

		let lastTick = null;

		const onTick = clock => {
			const subscribedDuration = clock.current - subscribed;
			const subscribedTicks = Math.floor(subscribedDuration / Interval);

			safeCall(fn, [
				{
					clock: { ...clock },
					ticks: subscribedTicks,
					duration: subscribedDuration,
					delta: clock.current - lastTick,
				},
			]);

			lastTick = clock.current;
		};

		this.addListener(Tick, onTick);

		this.#start();

		return () => {
			this.removeListener(Tick, onTick);

			if (this.listenerCount(Tick) === 0) {
				this.#stop();
			}
		};
	}

	#onTick() {
		if (!this.#state.running || this.#state.paused) {
			return;
		}

		const now = new Date();

		this.#state.current = now;
		this.#state.duration = now - this.#state.started;

		this.emit(Tick, this.#state);

		setTimeout(() => this.#onTick(), Interval);
	}

	#start() {
		if (this.#state.running) {
			return;
		}

		const now = new Date();

		this.#state.running = true;
		this.#state.started = now;

		VisibilityMonitor.addChangeListener(this.onVisibilityChange);
	}

	#stop() {
		if (!this.#state.running) {
			return;
		}

		this.#state = {};
		this.#state.running = false;

		VisibilityMonitor.removeChangeListener(this.onVisibilityChange);
	}

	onVisibilityChange = visible => {
		if (!visible) {
			this.#state.paused = true;
		} else if (visible && this.#state.paused) {
			this.#state.paused = false;
			this.#onTick();
		}
	};
}

export const Clock = new SystemClock();
