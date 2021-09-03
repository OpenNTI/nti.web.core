export declare function dispatch(state: any): void;

export declare function reset(): void;

/**
 * A factory that produces a setter. ex:
 *
 *     const setTitle = getSetter('title');
 *     <input onChange={setTitle} value={title} />
 *
 * where the setter is defined as:
 *
 * 		setTitle:= (x => setState({title: x}))
 *
 * The returned setter is stable for the life of the component. *
 */
export declare function getSetter(
	...keys: string[]
): (...values: any[]) => void;
