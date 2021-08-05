/**
 * Get the height of the :before and :after pseudo elements
 *
 * @param {HTMLElement} element
 * @returns {number}
 */
export default function getPseudoElementSpace(element) {
	try {
		return ['::before', '::after'].reduce(
			(x, pseudo) =>
				x +
				(parseInt(getComputedStyle(element, pseudo).height, 10) || 0),
			0
		);
	} catch {
		return 0;
	}
}
