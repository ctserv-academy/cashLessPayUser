import React, { useCallback, useState } from 'react'
import './mainFilter.css'
import './FilterItem.css'

export default function FilterItem({ itemData, itemClicked, ...rest }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const _render = useCallback(() => {
        if (!itemData.colOptions || itemData.colOptions.length === 0) {
            return (
                <li key={itemData.colCaption} className='filter-menu-list-listitem' onClick={
                    itemClicked(itemData)
                }>{itemData.colCaption}</li>)
        }
        else {
            return (
                <li className='filter-menu-list-listitem-group'
                    onClick={

                        itemClicked(itemData)
                    } >
                    <div key={itemData.colCaption} className='filter-menu-list-listitem '>
                        <div className='filter-menu-list-listitem-multi-item-div'>
                            {itemData.colCaption}
                        </div>
                        <span className='v-icon filter-menu-list-listitem-multi-item-icon'
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsExpanded(!isExpanded)
                            }}>
                            <i className={`v-icon-image material-icons filter-menu-list-listitem-multi-item-icon ${isExpanded ? 'filter-menu-list-listitem-multi-item-icon-reversed' : ''}`}>
                                expand_more
                            </i>
                        </span>
                    </div >
                    {
                        isExpanded && <>
                            <ul className='filter-menu-list-listitem-multi-item-itemoptions-ul'>
                                {
                                    itemData.colOptions.map((v, i) => {
                                        return <li key={`{${v.option}_${i}}`} className='filter-menu-list-listitem filter-menu-list-listitem-with-color' onClick={

                                            itemClicked(itemData, false, { ...v })
                                        }

                                        >
                                            <span className='v-icon filter-menu-list-listitem-multi-item-itemoptions-iconspan'>
                                                <i className={`v-icon-image material-icons filter-menu-list-listitem-multi-item-itemoptions-icon`}>
                                                    auto_awesome
                                                </i>
                                            </span>
                                            {
                                                v.option
                                            }

                                        </li>
                                    })
                                }

                            </ul>
                        </>
                    }
                </li>

            )
        }

    }, [itemData, isExpanded, itemClicked])

    return (<>
        {_render()}
    </>

    )
}
