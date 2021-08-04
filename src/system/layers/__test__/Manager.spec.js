/* eslint-env jest */

import LayerManager, { LayerLevelAttr } from '../Manager';

function getAllLayers() {
	return Array.from(document.querySelectorAll(`[${LayerLevelAttr}]`));
}

describe('Layer Manager', () => {
	describe('createLayer', () => {
		test('default layer config', () => {
			const layer = LayerManager.createLayer();

			expect(layer.level).toEqual('modal');

			expect(layer.node.tagName).toBe('DIV');
			expect(layer.node.className).toBe('');

			expect(layer.masked).toBeFalsy();

			LayerManager.removeLayer(layer);
		});

		test('inserts levels in correct order and masks', () => {
			const content = LayerManager.createLayer({ level: 'content' });
			const app = LayerManager.createLayer({ level: 'app-chrome' });

			expect(content.masked).toBeFalsy();
			expect(app.masked).toBeFalsy();
			expect(getAllLayers()).toEqual([content.node, app.node]);

			const modal = LayerManager.createLayer({ level: 'modal' });

			expect(content.masked).toBeTruthy();
			expect(app.masked).toBeTruthy();
			expect(modal.masked).toBeFalsy();
			expect(getAllLayers()).toEqual([
				content.node,
				app.node,
				modal.node,
			]);

			LayerManager.removeLayer(content);
			LayerManager.removeLayer(app);
			LayerManager.removeLayer(modal);
		});
	});

	describe('removeLayer', () => {
		test('updated layer masks', () => {
			const content = LayerManager.createLayer({ level: 'content' });
			const modal = LayerManager.createLayer({ level: 'modal' });

			expect(content.masked).toBeTruthy();

			LayerManager.removeLayer(modal);

			expect(content.masked).toBeFalsy();

			LayerManager.removeLayer(content);
		});
	});
});
