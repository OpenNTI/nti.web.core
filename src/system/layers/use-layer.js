import { useState, useEffect } from 'react';

import Manager from './Manager';

export default function useLayer(config) {
	const [layer] = useState(() => Manager.createLayer(config));

	useEffect(() => {
		() => Manager.removeLayer(layer);
	}, []);

	useEffect(() => {
		Manager.updateLayer(layer, config);
	}, [config]);

	return layer;
}
