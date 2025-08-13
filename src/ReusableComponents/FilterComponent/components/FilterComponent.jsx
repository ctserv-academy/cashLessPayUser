
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useOutsideClick } from '../hooks/useOutsideClick';
import { FilterContext } from './ContextProviders/FilterContext';
import './mainFilter.css'
import './FilterComponent.css'
import FilterGroup from './FilterGroup';
import FilterMenu from './FilterMenu';

export default function FilterComponent(props) {
    const { selectedFilter, setFilter } = useContext(FilterContext);

    const [isSearchExpanded, setisSearchExpanded] = useState(false);
    const [isFilterExpanded, setisFilterExpanded] = useState(false);
    const [isFilterListExpanded, setisFilterListExpanded] = useState(false);


    const inputRef = useRef(null);
    const searchRef = useRef(null);
    const filterRef = useRef(null);

    const [selectedfilterList, setselectedFilterList] = useState([]);


    useEffect(() => {
        setFilter(props.filterOptions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.filterOptions]);
    useEffect(() => {
        props.onFilterChange(selectedFilter)
    }, [selectedFilter])

    useEffect(() => {
        if (isSearchExpanded) {
            inputRef.current.focus()
        }
    }, [isSearchExpanded]);

    useEffect(() => {
        if (!isFilterExpanded) {
            setisFilterListExpanded(false)
        }
    }, [isFilterExpanded])

    useOutsideClick([searchRef, filterRef], () => {
        setisSearchExpanded(false)
        setisFilterExpanded(false)
        setisFilterListExpanded(false)
    })


    return (

        <div className="mycontainer" >
            <div className={`search-div ${isSearchExpanded | isFilterExpanded ? 'search-div-expanded' : ''} ${isFilterExpanded ? 'search-div-bottomless' : ''}`} ref={searchRef}>
                <span id='search_icon' className='v-icon' onClick={() => {
                    setisSearchExpanded(!isSearchExpanded)
                    // document.getElementsByClassName('filter-div')[0].style.width = '500px'
                }}>
                    <i className='v-icon-image material-icons'>
                        search
                    </i>
                </span>
                <input className='search-input' placeholder='Search items...'
                    ref={inputRef} />
                <span id='filter_icon' className='v-icon' onClick={() => {
                    setisFilterExpanded(!isFilterExpanded)
                }} >
                    <i className='v-icon-image material-icons'>
                        filter_list
                    </i>
                </span>
            </div>

            <div className={`filter-div ${!isFilterExpanded ? 'filter-div-hidden' : ''} ${isFilterExpanded | isSearchExpanded ? 'filter-div-expanded' : ''}`} ref={filterRef} >
                <FilterGroup selectedFilterData={selectedfilterList} />
                <div className='filter-section-container' onClick={() => { setisFilterListExpanded(!isFilterListExpanded) }}>
                    <div className='filter-section-buttons-div'>
                        <button className='filter-section-add-filter-button'>
                            <span className='v-icon'>
                                <i className='v-icon-image material-icons'>
                                    add
                                </i>
                            </span>
                            <span >
                                Add Filter
                            </span>
                            <span className='v-icon toggle-filter-options-span'
                            >
                                <i className={`v-icon-image material-icons toggle-filter-options-icon ${isFilterListExpanded ? 'toggle-filter-option-icon-reversed' : ''}`}>
                                    expand_more
                                </i>
                            </span>
                        </button>
                    </div>
                </div>
                <FilterMenu isOpen={isFilterListExpanded} />
            </div>
        </div >
    )
}
