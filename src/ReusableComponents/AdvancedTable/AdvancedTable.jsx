import React, { useCallback, useEffect, useRef } from 'react';
import { cloneDeep, isEmpty } from 'lodash';
import RTable from './RTable'
import SelectComp from "../SelectComponent/SelectComponent";
import { FilterContextWrapper } from '../FilterComponent/components/ContextProviders/FilterContext';
import FilterComponent from '../FilterComponent/components/FilterComponent';
import { customTableSearch } from '../../utils/functions';
import { useStateWithCallback } from '../../CustomHooks/useStateWithCallback';
import ContainerComp from '../ContainerComp/ContainerComp';
import DateTimePickerComp from '../DateTimePickerComp/DateTimePickerComp'
import { convertToSQL } from '../FilterComponent/components/utils/utils';

export default function AdvancedTable({ columns, dataArray, triggerPaging, filterOptions, SearchParameters, recordCount, pageSize, currentPage, ...props }) {
    const STATE = useRef(
        {
            columns: [],
            filterText: '',
            dataArray: [],
            dataArrayFiltered: [],
            selectAll: 0,
            selectedFilterOptions: [],
            FilterOptions: [],

            OriginalFilter: [],
            filterComponentOptions: [],
            filterComponentgeneratedSQL: {
                sqlSyntax: '',
                EFSyntax: ''
            }



        }
    );
    const [state, setState] = useStateWithCallback(STATE.current);

    const onFilterComponentChange = useCallback((selectedFilter) => {
        setState(prv => {
            return {
                ...prv, filterComponentgeneratedSQL: {
                    // sqlSyntax: convertToSQL(selectedFilter),
                    EFSyntax: convertToSQL(selectedFilter, 'AND', true)
                }
            }
        }, (nextState, SetNextState) => {

            triggerPaging('', [], [], 0, nextState.filterComponentgeneratedSQL.EFSyntax);
        })


    }, [setState, triggerPaging])




    useEffect(() => {
        document.getElementsByClassName('ReactTable')[0].style.zIndex = 0;
        setState(prv => {

            let filterComponentOptions = filterOptions ? filterOptions.map(e => {
                return {
                    "colName": e.columnName,
                    "colCaption": e.columnCaption,
                    "colType": e.colType
                }


            }) : []

            let mapped = filterOptions ? filterOptions.map(e => {
                return {
                    label: e.columnCaption, value: e.columnName
                }

            }) : []


            return {
                ...prv,
                dataArray: dataArray,
                dataArrayFiltered: dataArray,
                columns: columns,
                FilterOptions: prv.FilterOptions?.length === 0 ? cloneDeep(mapped) : prv.FilterOptions,
                selectedFilterOptions: prv.FilterOptions?.length === 0 ? cloneDeep(mapped) : prv.selectedFilterOptions,
                OriginalFilter: filterOptions ? cloneDeep(filterOptions) : [],
                filterComponentOptions: filterComponentOptions.length > 0 ? filterComponentOptions : prv.filterComponentOptions
            }
        }, (nextState, SetNextState) => {
            customsearch(nextState.filterText, true)

        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns, dataArray, filterOptions])

    useEffect(() => {
        if (!isEmpty(SearchParameters) && isEmpty(state.SearchParameters)) {
            let selectors = SearchParameters.filter(e => e.type === 'select')
            let datetime = SearchParameters.filter(e => e.type === 'date')
            let selectorsStateObj = {}
            let datetimeStateObj = {}
            selectors.forEach(element => {
                selectorsStateObj[`${element.name}`] = element.options
                if (element.isMultiple) {
                    selectorsStateObj[`selected${element.name}`] = element.options.filter(e => element.value.includes(e.value))
                }
                else {
                    selectorsStateObj[`selected${element.name}`] = element.value;
                }
            })

            datetime.forEach(element => {
                datetimeStateObj[`${element.name}`] = element.value;
            })

            setState(prv => { return { ...prv, ...{ SearchParameters: SearchParameters }, ...cloneDeep(selectorsStateObj), ...cloneDeep(datetimeStateObj) } })


        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SearchParameters])

    useEffect(() => {
        if (state.selectedFilterOptions.length === 0 && state.FilterOptions.length > 0) {
            setState({ ...state, selectedFilterOptions: cloneDeep(state.FilterOptions) })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.selectedFilterOptions, state.FilterOptions])

    const extractSearchOptionsFromState = useCallback((stt) => {
        let searchOptions = []
        if (!isEmpty(stt.SearchParameters)) {
            let selectors = stt.SearchParameters.filter(e => e.type === 'select')
            let datetime = stt.SearchParameters.filter(e => e.type === 'date')

            selectors.forEach(element => {
                searchOptions.push({
                    name: element.name,
                    value: stt[`selected${element.name}`].map(e => e.value)
                })

            })

            datetime.forEach(element => {
                searchOptions.push({
                    name: element.name,
                    value: stt[`${element.name}`]
                })
            })
        }
        return searchOptions
    }, [])

    const customsearch = useCallback((value, isTriggeredOnStateChange) => {
        setState(prv => {
            let mapped = prv.OriginalFilter.map(e => {
                return {
                    ...e,
                    isSelected:
                        prv.selectedFilterOptions.findIndex(e1 => e.columnName === e1.value) > -1
                }
            });

            return {
                ...prv,
                filterText: value,
                dataArrayFiltered: customTableSearch(value, prv.dataArray, mapped)

            }
        }, (nextState, setNextState) => {
            if (triggerPaging && !isTriggeredOnStateChange) {

                let mappedFiltration = nextState.OriginalFilter.map(e => {
                    return {
                        ...e,
                        isSelected:
                            nextState.selectedFilterOptions.findIndex(e1 => e.columnName === e1.value) > -1
                    }
                }).filter(e => e.isSelected);

                let searchOptions = extractSearchOptionsFromState(nextState);

                triggerPaging(value.toLowerCase(), mappedFiltration, searchOptions, 0, state.filterComponentgeneratedSQL.EFSyntax);
            }
        })

    }, [extractSearchOptionsFromState, setState, state.filterComponentgeneratedSQL.EFSyntax])

    const handleFilterTextChange = useCallback((event) => {
        customsearch(event.target.value);
    }, [customsearch])


    // const handleFilterOptionsChange = useCallback((value, key) => {
    //     setState(prv => {
    //         return { ...prv, [key]: value }
    //     }, (nextState, setNextState) => {
    //         let mapped = state.OriginalFilter.map(e => {
    //             return {
    //                 ...e,
    //                 isSelected:
    //                     state.selectedFilterOptions.findIndex(e1 => e.columnName === e1.value) > -1
    //             }
    //         }).filter(e => e.isSelected);
    //         let searchOptions = extractSearchOptionsFromState(nextState);

    //         triggerPaging(nextState.filterText, mapped, searchOptions, 0, state.filterComponentgeneratedSQL.EFSyntax);
    //     })

    // }, [])

    const handleSearchValuesChange = useCallback((value, key) => {
        setState(prv => {
            return { ...prv, [key]: value }
        }, (nextState, setNextState) => {

            let mapped = state.OriginalFilter.map(e => {
                return {
                    ...e,
                    isSelected:
                        state.selectedFilterOptions.findIndex(e1 => e.columnName === e1.value) > -1
                }
            }).filter(e => e.isSelected);
            let searchOptions = extractSearchOptionsFromState(nextState);

            triggerPaging(nextState.filterText, mapped, searchOptions, 0, state.filterComponentgeneratedSQL.EFSyntax);
        })
    }, [extractSearchOptionsFromState, setState, state.OriginalFilter, state.filterComponentgeneratedSQL.EFSyntax, state.selectedFilterOptions])

    useEffect(() => {
        handleSearchDateValueChanges('z')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    const handleSearchDateValueChanges = useCallback((value, key, isvalid) => {
        if (key === 'z') {
            return
        }

        if (isvalid && state[key] === (value ? value.format("YYYY-MM-DD") : "")) {
            return
        }

        if (isvalid) {
            setState(
                { ...state, [key]: value ? value.format("YYYY-MM-DD") : "" }
                , (nextState, setNextState) => {

                    let mapped = nextState.OriginalFilter.map(e => {
                        return {
                            ...e,
                            isSelected:
                                nextState.selectedFilterOptions.findIndex(e1 => e.columnName === e1.value) > -1
                        }
                    }).filter(e => e.isSelected);
                    let searchOptions = extractSearchOptionsFromState(nextState);

                    triggerPaging(nextState.filterText, mapped, searchOptions, 0, state.filterComponentgeneratedSQL.EFSyntax);
                })
        }
    }, [state, extractSearchOptionsFromState, setState])

    const handleNextPrevious = useCallback((event) => {
        let mapped = state.OriginalFilter.map(e => {
            return {
                ...e,
                isSelected:
                    state.selectedFilterOptions.findIndex(e1 => e.columnName === e1.value) > -1
            }
        }).filter(e => e.isSelected);

        let searchOptions = extractSearchOptionsFromState(state);

        triggerPaging(state.filterText, mapped, searchOptions, event.target.name === 'next' ? 1 : -1, state.filterComponentgeneratedSQL.EFSyntax);
    }, [state, extractSearchOptionsFromState])

    const buildSearchSection = useCallback(() => {

        let jsxArr = [];
        let selectors = state.SearchParameters.filter(e => e.type === 'select')

        selectors.forEach((element, index) => {
            jsxArr.push(
                <div className='row mb-1 mt-1' key={'select' + index.toString()}>
                    <div className=" col-4">{element.label}</div>
                    <div className={`col-8`}>
                        <SelectComp
                            value={element.options.filter(e => element.value.includes(e.value))}
                            name={`selected${element.name}`}
                            options={element.options}
                            clearable
                            className=""
                            onChange={handleSearchValuesChange}
                            multi={element.isMultiple}

                        />
                    </div>

                </div>)

        });
        let datetime = state.SearchParameters.filter(e => e.type === 'date')
        datetime.forEach((element, index) => {
            jsxArr.push(
                <div className='row mb-1 mt-1' key={'date' + index.toString()}>
                    <div className=" col-4">{element.label}</div>
                    <div className={`col-8`}>
                        <DateTimePickerComp
                            selected={element.value}
                            onDateTimeChange={handleSearchDateValueChanges}
                            name={element.name}
                            placeholder="--/--/----"
                            dateSlash
                        />
                    </div>

                </div>)

        });

        return jsxArr
    }, [state, handleSearchDateValueChanges, handleSearchValuesChange])

    return (
        <>
            <div id="AdvancedTableSearchHeight" className={"row mt-3"}>

                {
                    filterOptions?.length > 0 ?
                        <>
                            {/* <div className={`${props.isFilterOptionOneRow ? "col-12  col-lg-11 mb-1" : "col-12 col-lg-4"}`}>
                                <SelectComp
                                    value={state.selectedFilterOptions}
                                    onChange={handleFilterOptionsChange}
                                    name="selectedFilterOptions"
                                    options={state.FilterOptions}
                                    clearable
                                    className=""
                                    multi={true}
                                /> */}

                            <div className=" col-12  col-lg-3">
                                <FilterContextWrapper >
                                    <FilterComponent filterOptions={state.filterComponentOptions} onFilterChange={onFilterComponentChange} />
                                </FilterContextWrapper>
                            </div>

                        </> : null
                }

                {props.enableSearch ?
                    <>
                        <div className={`${props.isFilterOptionOneRow ? "offset-lg-8 col-lg-4" : filterOptions?.length > 0 ? "col-12 offset-lg-5 col-lg-4" : " offset-lg-5  col-lg-4"}`}>
                            <input type="text" className="form-control form-control-sm" value={state.filterText} onChange={handleFilterTextChange} placeholder="Search ..." />
                        </div>
                    </>
                    :
                    null
                }

            </div>

            {
                !isEmpty(state.SearchParameters) ? <div className={"row mt-2"}>
                    <div className="col-12 col-lg-5">
                        <ContainerComp
                            containerHeader='Search Options'
                            containerBody={<>
                                {
                                    buildSearchSection()
                                }
                            </>}
                            addPlus={false}
                            name=""
                            onClickPlus={() => { }}
                        />

                    </div>
                </div> : null
            }

            <RTable
                data={state.dataArrayFiltered}
                columns={state.columns}
                style={{ maxHeight: props.maxHeight ? props.maxHeight : "620px", marginTop: "10px" }}
                minRows={props.minRows === undefined ? 0 : props.minRows}
                SubComponent={props.SubComponent ? props.SubComponent : null}
                resizable={props.resizable ? props.resizable : false}
                defaultSorted={props.defaultSorted ? props.defaultSorted : []}
                selected={state.selected}
                currentPage={currentPage}
                recordCount={recordCount}
                pageSize={pageSize}
                showPagination={props.showPagination ? props.showPagination : false}
                showRowSelectedAndRowCount={props.showRowSelectedAndRowCount}
            />
            {
                triggerPaging ?
                    <div className="pagination" >
                        <button className="btn btn-primary  btn-sm" name='pvs' onClick={handleNextPrevious} disabled={false}>
                            {'<'}
                        </button>&nbsp;&nbsp;

                        {
                            // state.dataArrayFiltered.length === 30 &&
                            <button className="btn btn-primary  btn-sm" name='next' onClick={handleNextPrevious} disabled={(currentPage * pageSize) >= recordCount}>
                                {'>'}
                            </button>
                        }
                    </div> : null
            }
        </>
    )
}