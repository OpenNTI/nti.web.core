/* eslint-env jest */
import { ByPrimaryAxis } from '../alignment-sizes';

describe('Alignment Sizing', () => {
	describe('Vertical Axis is Primary', () => {
		const Sizings = ByPrimaryAxis.vertical;

		test('Match Side', () => {
			const size = Sizings['match-side']({ width: 200 });

			expect(size.width).toEqual(200);
		});
	});
});
