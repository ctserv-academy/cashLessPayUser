import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FilterContext } from './ContextProviders/FilterContext';
import FilterItem from './FilterItem'
import './mainFilter.css'
import './FilterMenu.css'
import { getcomparisonOperators } from './utils/utils';

export default function FilterMenu({ isOpen, ...rest }) {

    const { filter, setSelectedFilter } = useContext(FilterContext);
    const [columns, setColumns] = useState([])
    useEffect(() => {
        setColumns(filter)
    }, [filter])

    const onMenuClick = useCallback((item, isOp = false, subMenu = null) => e => {
        if (subMenu) {
            e.stopPropagation()
        }

        let o = {};
        if (!isOp) {
            if (!subMenu) {
                o = {
                    "colName": item.colName,
                    "colCaption": item.colCaption,
                    "coltype": item.colType,
                    "colSelectedFilter": getcomparisonOperators(item.colType)[0],
                    "colSelectedFilterValue": "",
                    "colSelectedFilterValue1": ""
                }
            }
            else {
                o = {
                    "colName": item.colName,
                    "colCaption": `${subMenu.option} (${item.colCaption})`,
                    "coltype": subMenu.colType,
                    "colsubOption": subMenu.option,
                    "colSelectedFilter": getcomparisonOperators(subMenu.colType)[0],
                    "colSelectedFilterValue": "",
                    "colSelectedFilterValue1": "",
                }
            }
        }
        else {
            o = {
                "colCaption": "AND",
                "coltype": "conditionalOp",
                "colSubElements": []
            }
        }
        setSelectedFilter(prv => {
            let arr = [...prv]
            arr.push(o)
            return arr
        })


    }, [setSelectedFilter])

    return (
        <div className={`filter-menu-list ${!isOpen ? 'filter-menu-list-hidden' : ''}`} >
            <ul className='filter-menu-list-ul'>
                <li className='filter-menu-list-listitem' onClick={onMenuClick(null, true)}>And / Or group</li>
                <div className='filter-menu-list-separator-div'>
                    <hr className='filter-menu-list-separator'></hr>
                </div>
                {
                    columns.map((v, i) => {
                        return <FilterItem itemClicked={onMenuClick} key={`c_${v.colCaption}`} itemData={v} />
                    })
                }
            </ul>




        </div>
    )
}
