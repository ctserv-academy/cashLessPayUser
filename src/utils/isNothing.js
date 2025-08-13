const FALSY_VALUES = [false, null, undefined];

export const isNothing = (value) => FALSY_VALUES.includes(value);