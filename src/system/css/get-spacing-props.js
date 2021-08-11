/** @typedef {'xs' | 'sm' | 'md' | 'lg' | 'xl'} SpacingPropValue */

/**
 * @typedef {object} PaddingProps
 * @property {SpacingPropValue=} p - set padding on all sides
 * @property {SpacingPropValue=} ph - set padding inline (left and right)
 * @property {SpacingPropValue=} pv - set padding block (top and bottom)
 * @property {SpacingPropValue=} pt - set padding top
 * @property {SpacingPropValue=} pr - set padding right
 * @property {SpacingPropValue=} pb - set padding bottom
 * @property {SpacingPropValue=} pl - set padding left
 */

/**
 * @typedef {object} MarginProps
 * @property {SpacingPropValue=} m - set margin on all sides
 * @property {SpacingPropValue=} mh - set margin inline (left and right)
 * @property {SpacingPropValue=} mv - set margin block (top and bottom)
 * @property {SpacingPropValue=} mt - set margin top
 * @property {SpacingPropValue=} mr - set margin right
 * @property {SpacingPropValue=} mb - set margin bottom
 * @property {SpacingPropValue=} ml - set margin left
 */

/** @typedef {(PaddingProps & MarginProps)} SpacingProps */

import cx from 'classnames';

import Styles from './rules/spacing.module.css';

const PaddingTop = 'padding-top';
const PaddingRight = 'padding-right';
const PaddingBottom = 'padding-bottom';
const PaddingLeft = 'padding-left';

const MarginTop = 'margin-top';
const MarginRight = 'margin-right';
const MarginBottom = 'margin-bottom';
const MarginLeft = 'margin-left';

const TypeToSides = {
	p: [PaddingTop, PaddingRight, PaddingBottom, PaddingLeft],
	m: [MarginTop, MarginRight, MarginBottom, MarginLeft],
};

/**
 * All possible size values/postfixes.
 *
 * @enum {string}
 */
const Sizes = { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' };
const SizesList = Object.keys(Sizes);

/**
 * A map of prop names/prefixes to which sides they set in order [top, right, bottom, left]
 */
const SidesMapping = {
	p: [PaddingTop, PaddingRight, PaddingBottom, PaddingLeft],
	ph: [PaddingRight, PaddingLeft],
	pv: [PaddingTop, PaddingBottom],
	pt: [PaddingTop],
	pr: [PaddingRight],
	pb: [PaddingBottom],
	pl: [PaddingLeft],

	m: [MarginTop, MarginRight, MarginBottom, MarginLeft],
	mh: [MarginRight, MarginLeft],
	mv: [MarginTop, MarginBottom],
	mt: [MarginTop],
	mr: [MarginRight],
	mb: [MarginBottom],
	ml: [MarginLeft],
};

/**
 * A map of propNames to functions that take the prop value and return the sizes for each side.
 *
 * Adds entries for `p={size}` as well as `p-{size}` prop format
 *
 * @type {Map<string, (any) => string>}
 */
const PropsToSides = Object.entries(SidesMapping).reduce(
	(acc, [key, sides]) => {
		const getSides = value =>
			sides.reduce((acc, side) => ({ ...acc, [side]: value }), {});

		/*
			Example Entries:
			p: (value) => {[PaddingTop]: value, ...}
			ph: (value) => {[PaddingRight]: value, [PaddingLeft]: value}
		*/
		acc.set(key, getSides);

		for (let size of SizesList) {
			/*
				Example Entries:
				p-sm: () => {[PaddingTop]: 'sm', ...}
				ph-lg: () => {[PaddingRight]: 'lg', [PaddingLeft]: 'lg'}
			*/
			acc.set(`${key}-${size}`, () => getSides(size));
		}

		return acc;
	},
	new Map()
);

/**
 * Given props return the size for each side
 *
 * @param {object} props
 * @returns {{}}
 */
function getSideSizes(props = {}) {
	return Object.entries(props).reduce((acc, [key, value]) => {
		if (!PropsToSides.has(key)) {
			return acc;
		}

		return {
			...acc,
			...PropsToSides.get(key)(value),
		};
	}, {});
}

function getClass(type, side, size) {
	return Styles[`${type}${side}-${size}`];
}

/**
 * Return the minimum class name set to apply the side sizes for the given type
 *
 * @param {string} type
 * @param {{}} sideSizes
 * @returns {string}
 */
function getClassNames(type, sideSizes) {
	const sides = TypeToSides[type];

	const top = 0;
	const right = 1;
	const bottom = 2;
	const left = 3;

	const isSet = i => sideSizes[sides[i]] != null;
	const value = i => sideSizes[sides[i]];
	const equal = (...i) => new Set(i.map(value)).size === 1;

	//If all sides are equal
	if (equal(top, right, bottom, left)) {
		//If there is a value return that class name otherwise there is no class name for this type.
		return isSet(top) ? getClass(type, '', value(top)) : null;
	}

	const classes = [];

	//if top and bottom are set and equal return a vertical class name
	if (isSet(top) && isSet(bottom) && equal(top, bottom)) {
		classes.push(getClass(type, 'v', value(top)));
	} else {
		//if top is set apply a top class name
		classes.push(isSet(top) ? getClass(type, 't', value(top)) : null);
		//if bottom is set apply a bottom class name
		classes.push(isSet(bottom) ? getClass(type, 'b', value(bottom)) : null);
	}

	//if right and left are set and equal return a horizontal class name
	if (isSet(right) && isSet(left) && equal(right, left)) {
		classes.push(getClass(type, 'h', value(right)));
	} else {
		//if right is set apply a right class name
		classes.push(isSet(right) ? getClass(type, 'r', value(right)) : null);
		//if left is set apply a left class name
		classes.push(isSet(left) ? getClass(type, 'l', value(left)) : null);
	}

	return cx(classes);
}

/**
 * Get the props to apply the configured spacing.
 *
 * @template T
 * @param {T} props
 * @returns {Omit<T, SpacingProps>}
 */
function consumePaddingProps(props) {
	return Object.keys(PropsToSides).reduce(
		(acc, prop) => {
			delete acc[prop];

			return acc;
		},
		{ ...props }
	);
}

/**
 * Get the props to apply the configured spacing.
 *
 * @template {SpacingProps} T
 * @param {T} props
 * @param {SpacingProps=} defaults
 * @returns {Omit<T, SpacingProps> & {className: string}}
 */
export function getSpacingProps({ className, ...props }, defaults) {
	const sideSizes = { ...getSideSizes(defaults), ...getSideSizes(props) };

	return {
		className: cx(
			className,
			getClassNames('m', sideSizes),
			getClassNames('p', sideSizes)
		),
		...consumePaddingProps(props),
	};
}

/**
 * Get the props to apply the configured spacing.
 *
 * @template {SpacingProps} T
 * @param {T} props
 * @param {MarginProps=} defaults
 * @returns {Omit<T, MarginProps> & {className: string}}
 */
export function getMarginProps({ className, ...props }, defaults) {
	const sideSizes = { ...getSideSizes(defaults), ...getSideSizes(props) };

	return {
		className: cx(className, getClassNames('m', sideSizes)),
		...consumePaddingProps(props),
	};
}
