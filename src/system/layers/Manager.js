/** @typedef {Layer} Layer */
/**
 * @typedef {object} LayerConfig
 * @property {string} as - tag to use for the layer
 * @property {string} className - class to set on the layer div
 * @property {('content' | 'app-chrome' | 'modal')} level - what position to render the layer to
 */

import EventEmitter from 'events';

import ReactDOM from 'react-dom';

import { createDOM, removeNode } from '@nti/lib-dom';

export const LayerLevelAttr = 'data-layer-level';
export const LayerMaskAttr = 'data-layer-mask';

const Mask = 'mask';
const NoMask = 'no-mask';

class Layer extends EventEmitter {
	#node = null;
	#masked = false;

	constructor(node) {
		super();

		this.#node = node;
	}

	/**
	 * Listen for updates to the Layer
	 *
	 * @param {() => void} fn -
	 * @returns {() => void} - unsubscribe function
	 */
	subscribe(fn) {
		this.addListener('change', fn);

		return () => this.removeListener('change', fn);
	}

	/**
	 * @type {HTMLElement} - element associated with the layer
	 */
	get node() {
		return this.#node;
	}

	/**
	 * @type {string} - the level the layer is on
	 */
	get level() {
		return this.#node.getAttribute(LayerLevelAttr);
	}

	/**
	 * @type {boolean} - if the layer masks layers beneath it
	 */
	get masks() {
		return this.#node.getAttribute(LayerMaskAttr) === Mask;
	}

	/**
	 * @type {boolean} - if the layer is masked by another layer
	 */
	get masked() {
		return this.#masked;
	}

	/**
	 * Mark the layer as being masked (or not) by another layer.
	 *
	 * @param {boolean} masked
	 */
	setMasked(masked) {
		if (masked !== this.masked) {
			this.#masked = masked;
			this.#node.setAttribute('aria-hidden', masked);
			this.emit('changed');
		}
	}

	/**
	 * Create a portal to the layer to render `children` to.
	 *
	 * @param {JSX.Element} children
	 * @returns {import('react').ReactElement}
	 */
	createPortal(children) {
		return ReactDOM.createPortal(children, this.#node);
	}

	render(children) {
		ReactDOM.render(children, this.#node);
	}
}

class LayerManager {
	static Levels = [
		{ name: 'content', masks: true },
		{ name: 'app-chrome' },
		{ name: 'modal', masks: true },
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
		const container = this.getContainer();

		const index = l => this.#levelMap[l]?.index ?? Infinity;
		const insertIndex = index(level);

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

		let masked = false;

		for (let i = layers.length - 1; i >= 0; i--) {
			const layer = layers[i];

			layer.setMasked(masked);
			masked = masked || layer.masks;
		}
	}

	/**
	 * Create a new layer
	 *
	 * @param {LayerConfig} config
	 * @returns {Layer}
	 */
	createLayer(config = {}) {
		const { as = 'div', className = '', level = 'modal' } = config;
		const domObject = {
			tag: as,
			[LayerLevelAttr]: level,
			[LayerMaskAttr]: this.#levelMap[level]?.masks ? Mask : NoMask,
		};

		if (className) {
			domObject.class = className;
		}

		const layer = new Layer(createDOM(domObject));

		const inserter = this.getInserter(level);
		inserter(layer.node);

		this.#layers.set(layer.node, layer);

		this.updateAria();

		return layer;
	}

	/**
	 * Update an existing layer
	 *
	 * @param {Layer} layer
	 * @param {LayerConfig} config
	 */
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

	/**
	 * Remove an existing layer
	 *
	 * @param {Layer} layer
	 */
	removeLayer(layer) {
		removeNode(layer.node);
		this.#layers.delete(layer.node);
		this.updateAria();
	}
}

export default new LayerManager();
