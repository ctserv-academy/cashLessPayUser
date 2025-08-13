import React, { useCallback, useEffect, useState } from 'react'
import DropDown from './Common/DropDown';
import './mainFilter.css'
import './FilterGroupElement.css'
import { getcomparisonOperators, numberOfInputsPerOperator } from './utils/utils';

export default function FilterGroupElement({ filterObject, dragAndDropFuntions, filterGroupUpdateStateFn, filterGroupDeleteFromStateFn, ...rest }) {
    const [filterData, setFilterData] = useState(null);
    // const [inputText, setInputText] = useState('');

    const [dropDownid, setDropDownid] = useState(null);

    const isDropDownOpen = useCallback((item) => {
        return item.id === dropDownid
    }, [dropDownid])

    const colCaption = useCallback((item, withid = false) => {
        return item.colCaption + (withid ? item.id : '')

    }, [])

    const colSelectedFilter = useCallback((item) => {
        if (item.coltype !== 'conditionalOp') {
            if (item.colSelectedFilter) {
                return item.colSelectedFilter
            }
            else {
                return getcomparisonOperators(item.coltype)[0]
            }
        }
        else {
            return '';
        }

    }, []);


    const dropDownOptions = useCallback((item) => {
        if (item) {
            let x = getcomparisonOperators(item.coltype)
            if (!x) {
            }
            return x
        }
        else {
            return [];
        }

    }, [])

    const changeSelectedFilter = useCallback((item) => (filterValue) => {
        filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilter: filterValue })
        // setFilterData({ ...filterData, colSelectedFilter: filterValue });

    }, [filterData, filterObject])

    const toggle = useCallback((value) => {
        setDropDownid(null)
    }, []);

    const filterButtonClicked = useCallback((item) => (e) => {
        setDropDownid(prv => { return item.id })

    }, [])

    const operatorButtonClicked = useCallback((item) => e => {
        if (item.colCaption.toLowerCase() === 'and') {
            filterGroupUpdateStateFn(item.id, { ...item, colCaption: 'or' })
        }
        else if (item.colCaption.toLowerCase() === 'or') {
            filterGroupUpdateStateFn(item.id, { ...item, colCaption: 'and' })
        }
    }, [filterObject])

    useEffect(() => {
        setFilterData(filterObject);
    }, [filterObject])

    const inputTextWidth = useCallback((item, colname = 'colSelectedFilterValue') => {
        if (item[colname].length === 0)
            return '3ch'


        return (item[colname].length + 1) * 8 + 'px'

    }, [filterData, filterObject])

    const buildSubHierarchy = useCallback((item) => {
        return <li key={`li_key_${item.id}${item.colCaption.replaceAll(' ', '')}`} id={`li_id_${item.id}${item.colCaption.replaceAll(' ', '')}`}
        >
            <div className='filter-group-li'  >
                <span className='v-icon' >
                    <i className={`v-icon-image material-icons buildSubHierarchyParent`}
                        draggable="true"
                        onDragEnter={dragAndDropFuntions.handleDragEnter({ ...item })}
                        onDragOver={dragAndDropFuntions.handleDragOver({ ...item })}
                        onDragLeave={dragAndDropFuntions.handleDragLeave({ ...item })}
                        onDrop={dragAndDropFuntions.handleDrop({ ...item })}
                        onDragEnd={dragAndDropFuntions.handleDragEnd({ ...item })}
                        data-allowdragover='Y'
                        data-isconditionalop='Y'
                        data-hierarchyid={item.id}
                        onDragStart={dragAndDropFuntions.handleDragStart({ ...item })}
                    >
                        drag_indicator
                    </i>
                </span>
                <button key={`FiltGroupElement_key_${item.id}${item.colCaption.replaceAll(' ', '')}${item.colCaption.replaceAll(' ', '')}`}
                    className={`filter-group-li-button-conditionalOp ${item.colCaption.toLowerCase() === 'and' ? ' AND' : ' OR'}`} onClick={(operatorButtonClicked(item))}>
                    {item.colCaption}
                </button>
                {
                    renderDelete(item)
                }

            </div>

            <ul key={`ul_key_${item.id}${item.colCaption.replaceAll(' ', '')}`}>
                {
                    item.colSubElements.map((v, i) => {
                        if (v.coltype === 'conditionalOp') {
                            return buildSubHierarchy(v)
                        }
                        else {
                            return <div key={`FiltGroupElementdiv_${v.id}_${colCaption(v, true).replaceAll(' ', '')}`} className='buildSubHierarchyChild'>
                                {
                                    v.coltype !== 'conditionalOp' &&
                                    <DropDown controlId={`FiltGroupElement_${v.id}_${colCaption(v, true).replaceAll(' ', '')}`} key={`FiltGroupElement_${v.id}_${colCaption(v, true).replaceAll(' ', '')}`} dropDownOptions={dropDownOptions(v)} dropDownValueChanged={changeSelectedFilter(v)} isOpen={isDropDownOpen(v)} toggle={toggle} />
                                }
                                <li id={`li_id_${v.id.toString()}_${i.toString()}${v.colCaption.replaceAll(' ', '')}`}
                                    key={`li_key_${v.id.toString()}_${i.toString()}${v.colCaption.replaceAll(' ', '')}`}
                                    className='filter-group-unselectable-li'
                                >
                                    <div className='filter-group-li'  >
                                        <span className='v-icon' >
                                            <i className={`v-icon-image material-icons`}
                                                draggable="true"
                                                data-allowdragover='Y'
                                                data-isconditionalop='N'
                                                data-hierarchyid={v.id}
                                                onDragEnter={dragAndDropFuntions.handleDragEnter({ ...v })}
                                                onDragOver={dragAndDropFuntions.handleDragOver({ ...v })}
                                                onDragLeave={dragAndDropFuntions.handleDragLeave({ ...v })}
                                                onDrop={dragAndDropFuntions.handleDrop({ ...v })}
                                                onDragEnd={dragAndDropFuntions.handleDragEnd({ ...v })}
                                                onDragStart={dragAndDropFuntions.handleDragStart({ ...v })}
                                            >
                                                drag_indicator
                                            </i>
                                        </span>
                                        <span className='filter-group-li-colCaption'>{v.colCaption}</span>
                                        <button id={`FiltGroupElement_${v.id}_${colCaption(v, true).replaceAll(' ', '')}`}
                                            key={`FiltGroupElement_key_${v.id}${v.colCaption.replaceAll(' ', '')}${v.colCaption.replaceAll(' ', '')}`}
                                            className='filter-group-li-button' onClick={filterButtonClicked(v)}>
                                            {colSelectedFilter(v)}
                                        </button>
                                        {
                                            renderInput(v)
                                        }
                                        {
                                            renderDelete(v)
                                        }
                                    </div>
                                </li>
                            </div>
                        }
                    })
                }
            </ul>
        </li>

    }, [filterObject, filterData, dropDownid])



    const renderInput = useCallback((item = filterObject) => {
        let n = numberOfInputsPerOperator(item.colSelectedFilter)

        if (item.coltype === 'string' || item.coltype === 'number') {

            if (n === 1) {
                return <input key={`input_${item.id}`} type='text' pattern="true" placeholder='--'
                    className='filter-group-li-input'
                    value={item.colSelectedFilterValue} onChange={(e) => {
                        filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue: e.target.value })

                    }} style={{ width: `${inputTextWidth(item)}` }} />
            }
            else if (n === 2) {
                return <>
                    <input key={`input_${item.id}`} type='text' pattern="true" placeholder='--'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue: e.target.value })

                        }} style={{ width: `${inputTextWidth(item)}` }} />
                    <span className='filter-group-li-input-and'> AND </span>
                    <input key={`input2_${item.id}`} type='text' pattern="true" placeholder='--'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue1} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue1: e.target.value })

                        }} style={{ width: `${inputTextWidth(item, 'colSelectedFilterValue1')}` }} />

                </>
            }
            else {
                return null
            }

        }
        else if (item.coltype === 'date') {

            if (n === 1) {
                return <>
                    <input key={`input_${item.id}`} type='text' pattern="true" placeholder='--'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue: e.target.value })

                        }} style={{ width: `${inputTextWidth(item)}` }} />
                    <input key={`input_date_${item.id}`} type='date'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue: e.target.value })

                        }} />
                </>

            }
            else if (n === 2) {
                return <>
                    <input key={`input_${item.id}`} type='text' pattern="true" placeholder='--'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue: e.target.value })

                        }} style={{ width: `${inputTextWidth(item)}` }} />
                    <input key={`input_date_${item.id}`} type='date'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue: e.target.value })

                        }} />
                    <span className='filter-group-li-input-and'> AND </span>

                    <input key={`input_2_${item.id}`} type='text' pattern="true" placeholder='--'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue1} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue1: e.target.value })

                        }} style={{ width: `${inputTextWidth(item, 'colSelectedFilterValue1')}` }} />
                    <input key={`input_date_2_${item.id}`} type='date'
                        className='filter-group-li-input'
                        value={item.colSelectedFilterValue1} onChange={(e) => {
                            filterGroupUpdateStateFn(item.id, { ...item, colSelectedFilterValue1: e.target.value })

                        }} />

                </>


            }
            else {
                return null;
            }


        }
    }, [filterObject])


    const renderDelete = useCallback((item = filterObject) => {
        return <span className='v-icon'>
            <i className={`v-icon-image material-icons filter-group-li-delete`}
                onClick={e => {
                    filterGroupDeleteFromStateFn(item.id)

                }} >
                close
            </i>
        </span>

    }, [filterObject])

    const renderLi = useCallback(() => {
        if (filterObject.coltype !== 'conditionalOp') {
            return <div className='renderLi'>
                <DropDown controlId={`FiltGroupElement_${colCaption(filterObject, true).replaceAll(' ', '')}`} dropDownOptions={dropDownOptions(filterObject)} dropDownValueChanged={changeSelectedFilter(filterObject)} isOpen={isDropDownOpen(filterObject)} toggle={toggle} />
                <li id={`li_id_${colCaption(filterObject, true).replaceAll(' ', '')}`}
                    className='filter-group-unselectable-li'
                >
                    <div className='filter-group-li'  >
                        <span className='v-icon' >
                            <i className={`v-icon-image material-icons`}
                                draggable="true"
                                data-allowdragover='Y'
                                data-isconditionalop='N'
                                data-hierarchyid={filterObject.id}
                                key={`li_${colCaption(filterObject, true).replaceAll(' ', '')}`}
                                onDragEnter={dragAndDropFuntions.handleDragEnter({ ...filterObject })}
                                onDragOver={dragAndDropFuntions.handleDragOver({ ...filterObject })}
                                onDragLeave={dragAndDropFuntions.handleDragLeave({ ...filterObject })}
                                onDrop={dragAndDropFuntions.handleDrop({ ...filterObject })}
                                onDragEnd={dragAndDropFuntions.handleDragEnd({ ...filterObject })}
                                onDragStart={dragAndDropFuntions.handleDragStart({ ...filterObject })}
                            >
                                drag_indicator
                            </i>
                        </span>
                        <span className='filter-group-li-colCaption'>{colCaption(filterObject)}</span>
                        <button id={`FiltGroupElement_${colCaption(filterObject, true).replaceAll(' ', '')}`} className='filter-group-li-button' onClick={filterButtonClicked(filterObject)}>
                            {colSelectedFilter(filterObject)}
                        </button>
                        {
                            renderInput()
                        }
                        {
                            renderDelete()
                        }



                    </div>
                </li>
            </div>

        }
        else {
            // if (filterObject.colSubElements && filterObject.colSubElements.length > 0) {
            return buildSubHierarchy(filterObject)
            // }

        }

    }, [filterObject, filterData, dropDownid])

    return (
        <>

            {
                renderLi()
            }

        </>

    )
}
