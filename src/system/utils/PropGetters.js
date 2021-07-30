/** @typedef {*} PropValue - a value derived from props */
/** @typedef {{}} RestProps - the props not used deriving the prop value */
/** @typedef {(props:{}) => [PropValue, RestProps]} PropValueGetter */
/** @typedef {{string: PropValueGetter}} PropMap */
/** @typedef {(props:{}) => {}} PropMapper */

/**
 * Generate a function to pull a single variant out of props.
 *
 * Cases:
 * 1. Explicit - if the value of `props[explicitProp]` is in the variant list, use that as the variant and consume the `explicitProp` key.
 * 2. Boolean - if `props[variant]` is strictly `true`, use that variant and consume the `variant` key.
 * 3. Default - if no variant is found return `defaultVariant` and consume no keys.
 *
 * @param {string[]} variants - list of possible variants
 * @param {string} defaultVariant - fallback if no variant is found
 * @param {string} explicitProp - prop to check for an explicitly set variant
 * @returns {PropValueGetter}
 */
export function VariantGetter(
	variants,
	defaultVariant,
	explicitProp = 'variant'
) {
	return propsArg => {
		const props = { ...propsArg };

		let variant = null;
		let variantProp = null;

		//if there is an explicit variant prop and its in the variant set use that
		if (variants.includes(props[explicitProp])) {
			variant = props[explicitProp];
			variantProp = explicitProp;
		} else {
			//look for boolean props in the variant set or use the default
			variant = variants.find(v => props[v] === true) ?? defaultVariant;
			variantProp = variant;
		}

		delete props[variantProp];

		return [variant, props];
	};
}
/**
 * Generate a function to pull multiple state values out of props.
 *
 * Cases:
 * 1. Boolean - if `props[state]` is strictly `true` add that state value and consume the `state` key.
 * 2. Default - if no states are found in props return `defaultState` and consume no keys.
 *
 * @param {string[]} states - list of possible states
 * @param {string[]} defaultState - fallback if no state is found
 * @returns {PropValueGetter}
 */
export function StateGetter(states, defaultState = []) {
	return propsArg => {
		const props = { ...propsArg };

		//look for boolean props in the state set or use the default
		const state = states.filter(s => props[s] === true);

		for (let prop of states) {
			delete props[prop];
		}

		return [state.length ? state : defaultState, props];
	};
}

/**
 * Generate a function that given props returns an object with map keys set to their result and props not consumed by maps are
 *
 * @param {PropMap} map
 * @returns {PropMapper}
 */
export function PropMapper(map) {
	return props => {
		return Object.entries(map).reduce(
			(acc, [name, getter]) => {
				const [value, rest] = getter(acc);

				return { [name]: value, ...rest };
			},
			{ ...props }
		);
	};
}
