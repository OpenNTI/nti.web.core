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

export function StateGetter(states, defaultState = []) {
	return propsArg => {
		const props = { ...propsArg };

		//look for boolean props in the state set or use the default
		let state = states.filter(s => props[s] === true);
		state = state.length ? state : defaultState;

		const stateProps = state;

		for (let prop of stateProps) {
			delete props[prop];
		}

		return [state, props];
	};
}

export function PropGetter(named) {
	return props => {
		return Object.entries(named).reduce(
			(acc, [name, getter]) => {
				const [value, rest] = getter(acc);

				return { [name]: value, ...rest };
			},
			{ ...props }
		);
	};
}
