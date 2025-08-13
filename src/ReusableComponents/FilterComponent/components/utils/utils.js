const comparisonOperators = new Map([
    ['string', ["Contains", "Doesn't Contain", "Starts With", "Doesn't Start With", "Ends With", "Doesn't End With", "Equals", "Doesn't equal", "Is Empty", "Isn't Empty"]],
    ['date', ['Equals', "Doesn't Equal", "Less Than", "Less Than or Equal To", "Greater Than", "Greater Than or Equal To", "Is Between", "Isn't Between", "Is Empty", "Isn't Empty"]],
    ['number', ['Equals', "Doesn't Equal", "Less Than", "Less Than or Equal To", "Greater Than", "Greater Than or Equal To", "Is Between", "Isn't Between", "Is Empty", "Isn't Empty"]],

]);

const buildSQL = (colName, dataType, operator, value, value1) => {
    // let str = ''
    value = value.replaceAll("'", "''")
    value1 = value1.replaceAll("'", "''")

    if (dataType === '') {
        dataType = ''
    }
    if (operator === '') {
        operator = 'Equals'
    }
    if (dataType === 'string') {
        if (operator === 'Contains') {
            if (value)
                return `${colName} like '%${value}%'`
            else
                return `${colName} = ''`
        }
        else if (operator === "Doesn't Contain") {
            if (value)
                return `${colName} not like '%${value}%'`
            else
                return `${colName} <> ''`
        }
        else if (operator === 'Starts With') {
            return `${colName}  like '${value}%'`
        }
        else if (operator === "Doesn't Start With") {
            return `${colName} not like '${value}%'`
        }
        else if (operator === 'Ends With') {
            return `${colName}  like '%${value}'`
        }
        else if (operator === "Doesn't End With") {
            return `${colName} not like '%${value}'`
        }
        else if (operator === "Equals") {
            return `${colName} = '${value}'`
        }
        else if (operator === "Doesn't equal") {
            return `${colName} <> '${value}'`
        }
        else if (operator === "Is Empty") {
            return `isnull(${colName},'') = ''`
        }
        else if (operator === "Isn't Empty") {
            return `isnull(${colName},'') <> ''`
        }

    }
    else if (dataType === 'number') {
        value = value.trim() === '' ? '0' : value
        value1 = value1.trim() === '' ? '0' : value1
        if (operator === 'Equals') {
            return `${colName} = ${value} `
        }
        else if (operator === "Doesn't Equal") {
            return `${colName} <> ${value} `
        }
        else if (operator === "Less Than") {
            return `${colName} < ${value} `

        }
        else if (operator === "Less Than or Equal To") {
            return `${colName} <= ${value} `
        }
        else if (operator === "Greater Than") {
            return `${colName} > ${value} `
        }
        else if (operator === "Greater Than or Equal To") {
            return `${colName} >= ${value} `
        }
        else if (operator === "Is Between") {
            return `(${colName} BETWEEN ${value} AND ${value1}) `
        }
        else if (operator === "Isn't Between") {
            return `(NOT ${colName} BETWEEN ${value} AND ${value1}) `
        }
        else if (operator === "Is Empty") {
            return `isnull(${colName},0) = 0`
        }
        else if (operator === "Isn't Empty") {
            return `isnull(${colName},0) <> 0`
        }

    }
    else if (dataType === 'date') {
        if (operator === 'Equals') {
            return `${colName} = '${value}' `
        }
        else if (operator === "Doesn't Equal") {
            return `${colName} <> '${value}' `
        }
        else if (operator === "Less Than") {
            return `${colName} < '${value}' `

        }
        else if (operator === "Less Than or Equal To") {
            return `${colName} <= '${value}' `
        }
        else if (operator === "Greater Than") {
            return `${colName} > '${value}' `
        }
        else if (operator === "Greater Than or Equal To") {
            return `${colName} >='${value}' `
        }
        else if (operator === "Is Between") {
            return `(${colName} BETWEEN '${value}' AND '${value1}' )`
        }
        else if (operator === "Isn't Between") {
            return `(NOT ${colName} BETWEEN '${value}' AND '${value1}' )`
        }
        else if (operator === "Is Empty") {
            return `isnull(${colName},0) = 0`
        }
        else if (operator === "Isn't Empty") {
            return `isnull(${colName},0) <> 0`
        }
    }

}

const buildEFDynamicSQL = (colName, dataType, operator, value, value1) => {
    // let str = ''
    value = value.replaceAll("'", "''")
    value1 = value1.replaceAll("'", "''")

    if (dataType === '') {
        dataType = ''
    }
    if (operator === '') {
        operator = 'Equals'
    }
    if (dataType === 'string') {
        if (operator === 'Contains') {
            if (value)
                return `${colName}.Contains("${value}")`
            else
                return `${colName} = ""`
        }
        else if (operator === "Doesn't Contain") {
            if (value)
                return `!${colName}.Contains("${value}")`
            else
                return `${colName} <> ""`
        }
        else if (operator === 'Starts With') {
            return `${colName}.StartsWith("${value}%")`
        }
        else if (operator === "Doesn't Start With") {
            return `!${colName}.StartsWith("${value}%")`
        }
        else if (operator === 'Ends With') {
            return `${colName}.EndsWith("${value}%")`
        }
        else if (operator === "Doesn't End With") {
            return `!${colName}.EndsWith("${value}%")`
        }
        else if (operator === "Equals") {
            return `${colName} = "${value}"`
        }
        else if (operator === "Doesn't equal") {
            return `${colName} <> "${value}"`
        }
        else if (operator === "Is Empty") {
            return `${colName} is null`
        }
        else if (operator === "Isn't Empty") {
            return `!${colName} is null`
        }

    }
    else if (dataType === 'number') {
        value = value.trim() === '' ? '0' : value
        value1 = value1.trim() === '' ? '0' : value1
        if (operator === 'Equals') {
            return `${colName} = ${value} `
        }
        else if (operator === "Doesn't Equal") {
            return `${colName} <> ${value} `
        }
        else if (operator === "Less Than") {
            return `${colName} < ${value} `

        }
        else if (operator === "Less Than or Equal To") {
            return `${colName} <= ${value} `
        }
        else if (operator === "Greater Than") {
            return `${colName} > ${value} `
        }
        else if (operator === "Greater Than or Equal To") {
            return `${colName} >= ${value} `
        }
        else if (operator === "Is Between") {
            return `(${colName} >= ${value} AND ${colName} <= ${value1})`
            // return `(${colName} BETWEEN ${value} AND ${value1}) `
        }
        else if (operator === "Isn't Between") {
            return `!(${colName} >= ${value} AND ${colName} <= ${value1})`
            // return `(NOT ${colName} BETWEEN ${value} AND ${value1}) `
        }
        else if (operator === "Is Empty") {
            return `${colName} is null`
        }
        else if (operator === "Isn't Empty") {
            return `!${colName} is null`
        }

    }
    else if (dataType === 'date') {
        if (operator === 'Equals') {
            return `${colName} = '${value}' `
        }
        else if (operator === "Doesn't Equal") {
            return `${colName} <> '${value}' `
        }
        else if (operator === "Less Than") {
            return `${colName} < '${value}' `

        }
        else if (operator === "Less Than or Equal To") {
            return `${colName} <= '${value}' `
        }
        else if (operator === "Greater Than") {
            return `${colName} > '${value}' `
        }
        else if (operator === "Greater Than or Equal To") {
            return `${colName} >='${value}' `
        }
        else if (operator === "Is Between") {
            return `(${colName} BETWEEN '${value}' AND '${value1}' )`
        }
        else if (operator === "Isn't Between") {
            return `(NOT ${colName} BETWEEN '${value}' AND '${value1}' )`
        }
        else if (operator === "Is Empty") {
            return `isnull(${colName},0) = 0`
        }
        else if (operator === "Isn't Empty") {
            return `isnull(${colName},0) <> 0`
        }
    }

}
export const numberOfInputsPerOperator = (operator) => {


    if (["Contains", "Doesn't Contain", "Starts With", "Doesn't Start With", "Ends With", "Doesn't End With", "Equals", "Doesn't equal", "Less Than", "Less Than or Equal To", "Greater Than", "Greater Than or Equal To"].includes(operator)) {
        return 1;
    }
    else if (["Is Empty", "Isn't Empty"].includes(operator)) {
        return 0
    }
    else if (["Is Between", "Isn't Between"].includes(operator)) {
        return 2;
    }
    else {
        return 0;
    }
}

export const getcomparisonOperators = (key) => {
    return comparisonOperators.get(key)

}

export const index_objects = function (arr) {
    const index = {};
    function traverse(obj, path) {
        if (Array.isArray(obj)) {
            obj.forEach((item, i) => traverse(item, [...path, i]));
        } else if (typeof obj === "object") {
            for (const [key, value] of Object.entries(obj)) {
                traverse(value, [...path, key]);
            }
        } else {
            index[path.join(".")] = obj;
        }
    }
    traverse(arr, []);
    return index;
}

//Add an id key to a recursice structure to be able to index itand search it
export const index_array_elements = function (arr, index = '0') {
    if (Array.isArray(arr)) {
        arr.forEach((item, i) => {
            if (!Array.isArray(item) && typeof item === 'object') {
                item.id = `${index}.${i.toString()}`
                Object.keys(item).forEach((v) => {
                    index_array_elements(item[v], `${index}.${i.toString()}`)
                })
            }
            else {
                index_array_elements(item, `${index}.${i.toString()}`)
            }
        })
    }
}
//this function allows searching inside a recursive data structure,using the id generated 
//by index_array_elements
//The function will return the element object and the sub-array containing this object
export const search_indexed_array = function (arr, id, recursiveKeyName = 'colSubElements') {

    const idArray = id.split('.');

    const findItem = (subArray, index) => {
        const id = idArray.slice(0, index).join(".");
        const foundItem = subArray.find(e => e.id === id);

        if (foundItem) {
            if (index === idArray.length) {
                return [foundItem, subArray];
            }
            else {
                return findItem(foundItem[recursiveKeyName], index + 1)
            }
        }
        else {
            return findItem(arr, index + 1);
        }


    }
    return findItem(arr, 1);

}


export const deepCopy = function (source, destination) {
    destination = destination || {};

    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            destination[key] = Array.isArray(source[key]) ? [] : {};
            deepCopy(source[key], destination[key]);
        } else {
            destination[key] = source[key];
        }
    }

    return destination;
}


export function convertToSQL(structure, oper = 'AND', efDynamic = false, firstCall = true) {
    let sql = "";
    if (structure.length === 0) {
        return ''
    }

    if (!efDynamic) {
        sql += '('
    }

    for (let i = 0; i < structure.length; i++) {
        if (structure[i].coltype !== "conditionalOp") {
            if (i === 0 || sql.trim() === '(') {
                if (efDynamic) {
                    if (i === 0 && firstCall)
                        sql += '('
                    sql += ` ${buildEFDynamicSQL(structure[i].colName, structure[i].coltype, structure[i].colSelectedFilter, structure[i].colSelectedFilterValue, structure[i].colSelectedFilterValue1)}`
                } else {
                    sql += ` ${buildSQL(structure[i].colName, structure[i].coltype, structure[i].colSelectedFilter, structure[i].colSelectedFilterValue, structure[i].colSelectedFilterValue1)}`
                }

            }
            else {
                if (efDynamic) {
                    sql += ` ${oper} ${buildEFDynamicSQL(structure[i].colName, structure[i].coltype, structure[i].colSelectedFilter, structure[i].colSelectedFilterValue, structure[i].colSelectedFilterValue1)}`
                }
                else {
                    sql += ` ${oper} ${buildSQL(structure[i].colName, structure[i].coltype, structure[i].colSelectedFilter, structure[i].colSelectedFilterValue, structure[i].colSelectedFilterValue1)}`
                }



            }
            ;
        }
        else if (structure[i].colSubElements?.length > 0) {

            if (sql.trim() !== '(') {
                if (efDynamic) {
                    if (i === 0 && firstCall)
                        sql += '('
                    else
                        sql += `) ${oper} ( `
                }
                else {
                    sql += ` ${oper} ( `
                }

            }
            else {
                sql += ' ( '
            }

            sql += `${convertToSQL(structure[i].colSubElements, structure[i].colCaption, efDynamic, false)}  `
            if (!efDynamic)
                sql += ' ) '
        }

    }

    if (!efDynamic) {
        sql += ')';
    }
    else {
        if (firstCall)
            sql += ')'

    }


    return sql;
}


