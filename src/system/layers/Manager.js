import EventEmitter from 'events';

import ReactDOM from 'react-dom';

import { createDOM, removeNode } from '@nti/lib-dom';

const LayerLevelAttr = 'data-layer-level';
const LayerMaskAttr = 'data-layer-mask';

const Mask = 'mask';
const NoMask = 'no-mask';

class Layer extends EventEmitter {
	#node = null;
	#covered = false;

	constructor(node) {
		super();

		this.#node = node;
	}

	subscribe(fn) {
		this.addListener('change', fn);

		return () => this.removeListener('change', fn);
	}

	get node() {
		return this.#node;
	}

	get level() {
		return this.#node.getAttribute(LayerLevelAttr);
	}

	get masks() {
		return this.#node.getAttribute(LayerMaskAttr) === Mask;
	}

	get covered() {
		return this.#covered;
	}

	setCovered(covered) {
		if (covered !== this.covered) {
			this.#covered = covered;
			this.#node.setAttribute('aria-hidden', covered);
			this.emit('changed');
		}
	}

	createPortal(children) {
		return ReactDOM.createPortal(children, this.#node);
	}
}

class LayerManager {
	static Levels = [
		{ name: 'static' },
		{ name: 'modal', masks: true },
		{ name: 'app-chrome' },
		{ name: 'prompt', masks: true },
	];

	#levelMap = null;
	#layers = new Map();

	constructor() {
		this.#levelMap = this.constructor.Levels.reduce((acc, level, index) => {
			acc[level.name] = { ...level, index };

			return acc;
		}, {});
	}

	getContainer() {
		return document.body;
	}

	getLayers() {
		return Array.from(document.querySelectorAll(`[${LayerLevelAttr}]`)).map(
			l => this.#layers.get(l)
		);
	}

	getInserter(level) {
		const index = l => this.#levelMap[l].index;

		const insertIndex = index(level);

		const container = this.getContainer();
		const layers = this.getLayers();

		for (let layer of layers) {
			const layerIndex = index(level);

			if (layerIndex > insertIndex) {
				return node => container.insertBefore(node, layer.node);
			}
		}

		return node => container.appendChild(node);
	}

	updateAria() {
		const layers = this.getLayers();

		let masked = true;

		for (let i = layers.length - 1; i >= 0; i--) {
			const layer = layers[i];

			layer.setMasked(masked);
			masked = layer.masks;
		}
	}

	createLayer({ as = 'div', className, level }) {
		const layer = new Layer(
			createDOM({
				tag: as,
				class: className,
				[LayerLevelAttr]: level,
				[LayerMaskAttr]: this.#levelMap[level]?.masks ? Mask : NoMask,
			})
		);

		const inserter = this.getInserter(level);
		inserter(layer.node);

		this.#layers.set(layer.node, layer);

		this.updateAria();

		return layer;
	}

	updateLayer(layer, { as, className, level }) {
		//TODO: decide if we need to update the tag if `as` is different
		if (layer.node.className !== className) {
			layer.node.className = className;
		}

		if (layer.level !== level) {
			const inserter = this.getInserter(level);

			inserter(layer.node);
		}
	}

	removeLayer(layer) {
		removeNode(layer.node);
		this.#layers.delete(layer.node);
		this.updateAria();
	}
}

export default new LayerManager();
