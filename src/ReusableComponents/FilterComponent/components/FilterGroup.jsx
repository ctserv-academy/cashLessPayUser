import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContext } from 'react';
import { FilterContext } from './ContextProviders/FilterContext';
import './mainFilter.css'
import './FilterGroup.css'
import FilterGroupElement from './FilterGroupElement'
import { deepCopy, index_array_elements, search_indexed_array } from './utils/utils';

export default function FilterGroup(props) {

    const { selectedFilter, setSelectedFilter } = useContext(FilterContext);
    const [filterArray, setFilterArray] = useState([]);

    const dragSrcEl = useRef(null);
    const dragSrcDataObj = useRef(null);
    const handleDragStart = useCallback((dataObj) => (e) => {
        dragSrcEl.current = e.target;
        dragSrcDataObj.current = dataObj;
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('filter-group-dragElem');
    }, [])

    useEffect(() => {
        let arr = [...selectedFilter]
        index_array_elements(arr)

        setFilterArray(arr);

    }, [selectedFilter])

    const handleDragOver = useCallback((dataObj) => (e) => {
        if (e.preventDefault && e.target.dataset.allowdragover) {

            if (e.target.dataset.isconditionalop !== 'Y' && dragSrcEl.current.dataset.isconditionalop === 'Y') {
                return
            }
            else if (dragSrcEl.current.dataset.hierarchyid === e.target.dataset.hierarchyid) {
                return
            }
            else if (dragSrcEl.current.dataset.hierarchyid.length <= e.target.dataset.hierarchyid.length) {
                if (e.target.dataset.hierarchyid.includes(dragSrcEl.current.dataset.hierarchyid)) {
                    return

                }
                else { //do nothing in this case

                }
            }
            e.preventDefault();
        }
        else {
            return
        }
        e.target.classList.add('filter-group-dragElem-over');

        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.


    }, [])

    const handleDragEnter = useCallback((dataObj) => (e) => { }, [])

    const handleDragLeave = useCallback((dataObj) => (e) => {

        e.target.classList.remove('filter-group-dragElem-over');

    }, [])

    const handleDrop = useCallback((dataObj) => (e) => {
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }
        if (dragSrcEl.current !== e.target) {

            //Same  hierarchyid length, means that items are on the same level and should be swapped
            // if (dragSrcEl.current.dataset.hierarchyid.length === e.target.dataset.hierarchyid.length) {
            handleswapItems(dragSrcDataObj.current, dataObj)
            // }

        }
        e.target.classList.remove('filter-group-dragElem-over');
    }, [filterArray])

    const handleDragEnd = useCallback((dataObj) => (e) => {
        e.target.classList.remove('filter-group-dragElem');
    }, [])

    const updateState = useCallback((itemid, itemObject) => {
        let arr = [...filterArray];
        let [obj, subArr] = search_indexed_array(arr, itemid)
        deepCopy(itemObject, obj);
        // setFilterArray(arr)
        setSelectedFilter(arr)
    }, [filterArray,])

    const deleteFromState = useCallback((itemid) => {

        let arr = [...filterArray];
        let [obj, subArr] = search_indexed_array(arr, itemid)
        const index = subArr.indexOf(obj)
        subArr.splice(index, 1)
        index_array_elements(arr)
        // setFilterArray(arr)
        setSelectedFilter(arr)


    }, [filterArray])


    const dragAndDropFuntions = useMemo(() => { return { handleDragStart, handleDragOver, handleDragEnter, handleDragLeave, handleDrop, handleDragEnd } }, [filterArray])

    const handleswapItems = useCallback((element1, element2) => {
        // setFilterArray(prv => {

        const arr = [...filterArray];
        const [obj1, subArr1] = search_indexed_array(arr, element1.id)
        const [obj2, subArr2] = search_indexed_array(arr, element2.id)

        const index1 = subArr1.indexOf(obj1)
        const index2 = subArr2.indexOf(obj2)

        //Check DragAndDropRules.js for information
        if (element1.coltype !== 'conditionalOp' && element2.coltype !== 'conditionalOp') {
            const temp = subArr1[index1];
            subArr1[index1] = subArr2[index2];
            subArr2[index2] = temp;
        }
        else if (element1.coltype === 'conditionalOp' || element2.coltype === 'conditionalOp') {
            //Dragging element1 over element2
            if (dragSrcDataObj.current.id === element1.id) {
                obj2['colSubElements'].push({ ...obj1 });
                subArr1.splice(index1, 1)
            }
            else if (dragSrcDataObj.current.id === element1.id) {
                obj1['colSubElements'].push({ ...obj2 });
                subArr2.splice(index2, 1)
            }
        }

        index_array_elements(arr)
        setSelectedFilter(arr)
        // })

    }, [filterArray]);


    const addFilter = useCallback((fltrObj) => (e) => {
        setFilterArray((prv) => {
            return [...prv, fltrObj];
        })

    }, [])

    return (
        <ul className='filter-group-ul'>
            {
                filterArray.map(e => {
                    return <FilterGroupElement key={`FilterGroupElement_${e.colCaption.replaceAll(' ', '')}${e.id}`}
                        filterObject={{ ...e }}
                        filterGroupUpdateStateFn={updateState}
                        dragAndDropFuntions={dragAndDropFuntions}
                        filterGroupDeleteFromStateFn={deleteFromState}
                    />
                })

            }
        </ul>
    )
}
