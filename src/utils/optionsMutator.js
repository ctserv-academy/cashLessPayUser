/**
 * It takes an array of objects, and returns an array of objects with the same keys, but with different
 * values.
 * @param dataArray - The array of objects that you want to convert to options.
 * @param label - the key of the label you want to use
 * @param value - the value of the option
 * @param extras - an array of strings that are the names of the extra properties you want to add to
 * the options.
 * @returns An array of objects with the following structure:
 * [
 *     {
 *         label: 'label',
 *         value: 'value',
 *         ...extras
 *     }
 * ]
 */
export const optionsMutator = (dataArray, label, value, ...extras) => {
    const options = [];
    dataArray.forEach((item, index) => {
        const optionItem = {};
        optionItem.label = item[label];
        optionItem.value = item[value];
        extras.forEach((extraItem, index) => {
            optionItem[extraItem] = item[extraItem];
        });
        options.push(optionItem);
    });
    return options;
}
