import { useState, useEffect } from 'react';

import Manager from './Manager';

/**
 * A hook to create a layer to render components to.
 *
 * @param {import('./Manager').LayerConfig} config
 * @returns {import('./Manager').Layer}
 */
export function useLayer(config) {
	const [layer] = useState(() => Manager.createLayer(config));

	useEffect(() => {
		() => Manager.removeLayer(layer);
	}, []);

	useEffect(() => {
		Manager.updateLayer(layer, config);
	}, [config]);

	return layer;
}
