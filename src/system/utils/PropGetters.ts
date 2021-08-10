/**
 * Generate a function to pull a single variant out of props.
 *
 * Cases:
 * 1. Explicit - if the value of `props[explicitProp]` is in the variant list, use that as the variant and consume the `explicitProp` key.
 * 2. Boolean - if `props[variant]` is strictly `true`, use that variant and consume the `variant` key.
 * 3. Default - if no variant is found return `defaultVariant` and consume no keys.
 *
 * @param variants - list of possible variants
 * @param defaultVariant - fallback if no variant is found
 * @param explicitProp - prop to check for an explicitly set variant
 */
export function VariantGetter<T extends object>(
	variants: string[],
	defaultVariant: string,
	explicitProp = 'variant'
): (props: T) => [string, T] {
	return propsArg => {
		const props = { ...propsArg };

		let variant: string = null;
		let variantProp: string = null;

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
 * @param states - list of possible states
 * @param defaultState - fallback if no state is found
 */
export function StateGetter<T extends object>(
	states: string[],
	defaultState: string[] = []
): (props: T) => [string[], T] {
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
 * Generate a function that will map props to a single value and remove the used props.
 *
 * @param getter
 * @param usedProps
 */
export function ValueGetter<T extends object>(
	getter: (props: T) => string,
	usedProps: [string]
): (props: T) => [string, T] {
	return propsArg => {
		const props = { ...propsArg };
		const result = getter(props);

		for (let prop of usedProps ?? []) {
			delete props[prop];
		}

		return [result, props];
	};
}

type Mapper = {
	[prop: string]: <T extends object>(props: T) => [string | string[], T];
};

/**
 * Generate a function that given props returns an object with map keys set to their result and props not consumed by maps are
 *
 * @param map
 */
export function PropMapper<T extends Mapper>(map: T) {
	return <P extends object>(props: P) => {
		const entries = Object.entries(map);

		const result = entries.reduce(
			(acc, [name, getter]) => {
				const [value, rest] = getter(acc);

				return { [name]: value, ...rest };
			},
			{ ...props }
		);

		return result as P &
			{ [Prop in keyof typeof map]: ReturnType<typeof map[Prop]>[0] };
	};
}
