/* eslint-env jest */
import { SizeByAxis } from '../alignment-sizes';

describe('Alignment Sizing', () => {
	describe('Vertical Axis is Primary', () => {
		const Sizings = SizeByAxis.vertical;

		test('Match Side', () => {
			const size = Sizings['match-side']({ width: 200 });

			expect(size.width).toEqual(200);
		});
	});
});
