export const getValue = o => o.value ?? o;
export const getLabel = o => o.label ?? o;
export const getKey = o => o.key ?? getValue(o);
