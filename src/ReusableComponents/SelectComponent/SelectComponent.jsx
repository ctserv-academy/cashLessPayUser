import PropTypes from "prop-types";
import React, { Component } from "react";
import Select, { components } from "react-select";
import CreatableSelect from 'react-select/creatable';
import { debounce, isEqual, isEmpty } from "lodash";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import List from "react-virtualized/dist/commonjs/List";
import { CellMeasurer, CellMeasurerCache } from "react-virtualized/dist/commonjs/CellMeasurer";
import './selectComponent.css'


export default class SelectComp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
            options: this.props.options ? this.props.options : [],
            listHeight: props.maxHeight,
            isHovering: false
        };

        this._cache = new CellMeasurerCache({
            defaultHeight: props.defaultOptionHeight,
            minHeight: props.defaultOptionHeight,
            fixedWidth: true
        });

        this._cellMeasureRefs = {};

    }

    static propTypes = {
        async: PropTypes.bool,
        listProps: PropTypes.object,
        maxHeight: PropTypes.number,
        defaultOptionHeight: PropTypes.number,
        optionRenderer: PropTypes.func,
        selectComponent: PropTypes.func
    };

    static defaultProps = {
        async: false,
        maxHeight: 200,
        defaultOptionHeight: 35
    };

    componentDidMount() { }

    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)) {
            return true;
        } else {
            return false
        }
    }

    componentDidUpdate(prevProps) {

        if (!isEqual(prevProps.options, this.props.options)) {
            this.setState({ options: this.props.options })
        }
        if (!isEqual(prevProps.value, this.props.value)) {

            this.setState({ value: this.props.value })
        }
    }

    handleChange = value => {
        if (this.props.special) {
            if (value?.status !== "I") {
                if (value) {
                    if (this.props.multi) {
                        if (isEmpty(value)) value = [];
                        this.setState({ value: value }, () => {
                            this.props.onChange(this.state.value, this.props.name)
                        })
                    } else {
                        if (isEmpty(value)) value = "";

                        this.setState({ value: value.value }, () => {
                            this.props.onChange(this.state.value, this.props.name)
                        })
                    }
                } else {
                    this.setState({ value: "" }, () => {
                        this.props.onChange(this.state.value, this.props.name)
                    })
                }
            } else {
                return;
            };

        } else {
            if (value) {
                if (this.props.multi) {
                    if (isEmpty(value)) value = [];
                    this.setState({ value: value }, () => {
                        this.props.onChange(this.state.value, this.props.name)
                    })
                } else {
                    if (isEmpty(value)) value = {};

                    this.setState({ value: value }, () => {
                        this.props.onChange(this.state.value, this.props.name, value.label)
                    })
                }
            } else {
                this.setState({ value: this.props.multi ? [] : null }, () => {
                    this.props.onChange(this.state.value, this.props.name)
                })
            }
        }


    }

    valueFromId = (opts, id) => opts.find(o => o.value === id);

    remeasure = debounce(() => {
        this._cache.clearAll();
        if (this._listRef) {
            this._listRef.recomputeRowHeights();
        }

        if (this._cellMeasureRefs) {
            Object.keys(this._cellMeasureRefs).forEach(key => {
                if (this._cellMeasureRefs[key]) {
                    this._cellMeasureRefs[key]._maybeMeasureCell();
                }
            });
        }

        this.setState({
            listHeight: this._calculateListHeight(this._cache._rowCount)
        });
    }, 50);

    /** See List#recomputeRowHeights */
    recomputeOptionHeights = (index = 0) => {
        if (this._listRef) {
            this._listRef.recomputeRowHeights(index);
        }
    }

    /** See Select#focus (in react-select) */
    focus = () => {
        if (this._selectRef) {
            return this._selectRef.focus();
        }
    }

    _renderMenu = ({ focusedOption, focusOption, labelKey, onSelect, options, selectValue, valueArray, valueKey }) => {
        const { listProps, optionRenderer } = this.props;
        const height = this._calculateListHeight(options.length);
        const focusedOptionIndex = options.indexOf(focusedOption);
        const innerRowRenderer = optionRenderer || this._optionRenderer;

        // react-select 1.0.0-rc2 passes duplicate `onSelect` and `selectValue` props to `menuRenderer`
        // The `Creatable` HOC only overrides `onSelect` which breaks an edge-case
        // In order to support creating items via clicking on the placeholder option,
        // We need to ensure that the specified `onSelect` handle is the one we use.

        function wrappedRowRenderer({ index, key, style, parent }) {
            const option = options[index];

            return innerRowRenderer({
                focusedOption, focusedOptionIndex, focusOption, key, labelKey, onSelect, option,
                optionIndex: index, options, selectValue: onSelect, style, valueArray, valueKey, parent
            });
        }

        return (
            <AutoSizer disableHeight>
                {({ width }) => (
                    <List
                        className="VirtualSelectGrid"
                        height={height}
                        ref={this._setListRef}
                        rowCount={options.length}
                        rowHeight={this._cache.rowHeight}
                        rowRenderer={wrappedRowRenderer}
                        scrollToIndex={focusedOptionIndex}
                        width={width}
                        deferredMeasurementCache={this._cache}
                        {...listProps}
                    />
                )}
            </AutoSizer>
        );
    }

    _calculateListHeight(numRows) {
        const { maxHeight, defaultOptionHeight } = this.props;

        let height = 0;
        for (let index = 0; index < numRows; index++) {
            height += this._cache.getHeight(index);
            if (height > maxHeight) {
                return maxHeight;
            }
        }

        if (!height) return defaultOptionHeight;
        return height;
    }

    _optionRenderer = ({
        focusedOption,
        focusOption,
        key,
        labelKey,
        option,
        optionIndex,
        selectValue,
        style,
        valueArray,
        parent
    }) => {
        const className = ["VirtualizedSelectOption"];

        if (option === focusedOption) {
            className.push("VirtualizedSelectFocusedOption");
        }

        if (option.disabled) {
            className.push("VirtualizedSelectDisabledOption");
        }

        if (valueArray && valueArray.indexOf(option) >= 0) {
            className.push("VirtualizedSelectSelectedOption");
        }

        if (option.className) {
            className.push(option.className);
        }

        const events = option.disabled
            ? {}
            : {
                onClick: () => selectValue(option),
                onMouseEnter: () => focusOption(option)
            };
        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={optionIndex}
                ref={ref => this._setCellMeasureRef(key, ref)}
            >
                <div
                    className={className.join(" ")}
                    key={key}
                    style={this.props.special && option.status === "I" ? { ...style, opacity: 0.4, cursor: "not-allowed" } : style}
                    title={option.title}
                    {...events}
                >
                    {option[labelKey]}
                </div>
            </CellMeasurer >
        );
    }

    _setSelectRef = (ref) => {
        this._selectRef = ref;
    }

    _setListRef = (ref) => {
        this._listRef = ref;
    }

    _setCellMeasureRef = (key, ref) => {
        this._cellMeasureRefs[key] = ref;
    }

    _getSelectComponent = () => {
        const { async, creatable } = this.props;

        if (creatable) {
            return CreatableSelect;
        } else if (async) {
            return Select.Async;
        } else {
            return Select;
        }
    }

    handleMouseEnter = () => {
        this.setState({ isHovering: true })
    };

    handleMouseLeave = () => {
        this.setState({ isHovering: false })
    };

    handleValueFromProps = () => {
        if (this.props.multi) {
            return this.state.value
        }
        else {
            if (typeof this.state.value === 'string') {
                return this.valueFromId(this.state.options, this.state.value)
            }
            else {
                return this.state.value
            }
        }
    }

    render() {

        const SelectComponent = this._getSelectComponent();

        const Control = ({ children, ...props }) => {

            return (
                <components.Control {...props}>
                    {children}
                    <div style={{ float: "right", width: "30px", padding: "8px", borderLeft: "1px solid #ccc", color: this.state.isHovering ? "rgb(129 127 127)" : "#ccc" }}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}>
                        <i className="fa fa-search"
                            onClick={this.props.openSelectorFiltrationModal(this.props.id)}
                        ></i>
                    </div>
                </components.Control>
            );
        };

        // const CustomMenu = (props) => {
        //     return (
        //         <div>
        //             <components.Menu {...props}>
        //                 {props.children}
        //                 {/* Button to appear at the bottom of the dropdown */}
        //                 <div className="row mt-1 mb-1" >
        //                     <div style={{width:"40%", marginLeft:"10px"}}>
        //                         <button
        //                             onClick={() => { this.props.changeColumns() }}
        //                             style={{
        //                                 background: "#007bff",
        //                                 color: "#fff",
        //                                 border: "none",
        //                                 borderRadius: "4px",
        //                                 padding: "5px 10px",
        //                                 cursor: "pointer",
        //                             }}
        //                         >
        //                             Apply
        //                         </button>
        //                     </div>
        //                     <div style={{width:"40%"}}>
        //                         <button
        //                             onClick={() => { this.props.closeMenu() }}
        //                             style={{
        //                                 background: "grey",
        //                                 color: "#fff",
        //                                 border: "none",
        //                                 borderRadius: "4px",
        //                                 padding: "5px 10px",
        //                                 cursor: "pointer",
        //                             }}
        //                         >
        //                             Cancel
        //                         </button>
        //                     </div>


        //                 </div>
        //             </components.Menu>
        //         </div>
        //     );
        // };

        return (
            <>
                <SelectComponent
                    closeMenuOnSelect={!this.props.closeMenuSelect}
                    components={this.props.openSelectorFiltrationModal ? { Control } : {}}
                    ref={this._setSelectRef}
                    id={this.props.id ? this.props.id : undefined}
                    value={this.handleValueFromProps()}
                    options={this.state.options ? this.state.options : []}
                    placeholder={this.props.placeholder ? this.props.placeholder : "Select..."}
                    onChange={this.handleChange}
                    tabIndex={this.props.tabindex}
                    onInputChange={(e) => {
                        if (this.props.filterChange) {
                            this.props.filterInputChange(this.props.name, e);
                            return;
                        };
                    }}
                    openMenuOnFocus
                    onFocus={this.props.onFocus ? this.props.onFocus : undefined}
                    onBlur={this.props.onBlur ? this.props.onBlur : undefined}
                    style={{ borderRadius: "4px", ...this.props.style }}
                    className={`${this.props.className}`}
                    isClearable={this.props.clearable ? true : false}
                    isMulti={this.props.multi ? true : false}
                    autosize={false}
                    isDisabled={this.props.disabled ? true : false}

                    menuRenderer={this._renderMenu}
                    menuStyle={{ overflow: "hidden" }}
                    onOpen={this.remeasure}
                    isOptionDisabled={(option) => option.isOptionDisabled}
                    noOptionsMessage={() => this.props.noOptionsMessage}
                    isOpen={this.props.menuIsOpen ? true : null}
                    getOptionLabel={this.props.getOptionLabel ? this.props.getOptionLabel : (option) => option.label}
                    getOptionValue={this.props.getOptionLabel ? this.props.getOptionLabel : (option) => option.value}
                />
            </>
        );
    }

}
