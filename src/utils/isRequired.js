/* This is a function that throws an error when a parameter is missing. */
export const isRequired = paramName => {
    throw new Error(`${paramName} is missing `);
}