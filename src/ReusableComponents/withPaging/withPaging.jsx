import { cloneDeep, isEqual } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { timeOutVar } from '../../utils/globals';


export const withPaging = (Comp) => (
    { fetchApiFunction, dataArray, columns, numberOfPages, ...props }) => {
    const timeout = useRef(null);
    const filterOptions = useRef([]);
    const pgNbr = useRef(1)
    const [cntr, setCntr] = useState(0)
    const AllFiltration = useRef(null);
    const [state, setState] = useState(0)
    
    useEffect(() => {
        if (dataArray && columns && dataArray.length > 0) {
            let obj = dataArray[0];
            let arr = [];
            Object.keys(obj).forEach(key => {
                let o1 = {};
                o1.columnName = key;
                let col = columns.find(e1 => e1.accessor === key);
                if (col?.Header) {
                    o1.columnCaption = col.Header
                    o1.colType = typeof obj[key]
                    arr.push(o1);
                }
            });
            filterOptions.current = [...arr]
            setState(prv => prv + 1)
        }
    }, [dataArray, columns, numberOfPages])
    const fetchData = useCallback((searchValue, selectedFilterOptions, searchOptions, sqlFilterText) => {
        return setTimeout(async () => {
            try {
                fetchApiFunction(searchValue, selectedFilterOptions, searchOptions, pgNbr.current, sqlFilterText);
            }
            catch (error) {
                throw error
            }
            finally {
            }
        }, timeOutVar)
    }, [])
    const triggerPaging = useCallback((searchValue, selectedFilterOptions, searchOptions, counter = 0, sqlFilterText) => {
        setCntr(cntr + 1)
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
        let searchObject = {
            searchValue: searchValue,
            selectedFilterOptions: cloneDeep(selectedFilterOptions),
            searchOptions: cloneDeep(searchOptions)
        }
        if (AllFiltration.current && !isEqual(searchObject, AllFiltration.current)) {
            AllFiltration.current = searchObject
            pgNbr.current = 1
            timeout.current = fetchData(searchValue, selectedFilterOptions, searchOptions, sqlFilterText);
        }
        else {
            AllFiltration.current = searchObject
            pgNbr.current = ((pgNbr.current + counter) < 1 ? 1 : (pgNbr.current + counter))
            timeout.current = fetchData(searchValue, selectedFilterOptions, searchOptions, sqlFilterText);
        }
    }, [])
    return (
        <Comp {...props}
            dataArray={dataArray}
            columns={columns}
            triggerPaging={triggerPaging}
            filterOptions={filterOptions.current} />
    )
}