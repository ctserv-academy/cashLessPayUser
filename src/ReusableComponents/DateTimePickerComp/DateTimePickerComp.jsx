import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import InputMask from 'react-input-mask';
import { isEqual } from 'lodash';
import './dateTimePickerComp.css'
class DateTimeInputMask extends React.Component {
    focus() { ReactDOM.findDOMNode(this._element).focus(); }
    render() {
        return (<InputMask {...this.props} ref={(element) => this._element = element} />);
    }
};

class DateTimePickerComp extends Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef()

        this.state = {
            date: this.props.value ? Moment(this.props.value) : "",
            selected: this.props.selected ? Moment(this.props.selected) : null,
            isValid: true
        };
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)) {
            return true;
        } else {
            return false
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!isEqual(prevProps, this.props)) {
            this.setState({
                selected: this.props.selected ? Moment(this.props.selected) : null,
                date: this.props.selected ? Moment(this.props.selected) : null,
            })
        }
    }

    onDateChange = (datetime) => {
        this.setState({
            selected: datetime,
            date: datetime,
            isValid: true
        }, () => {
            // if (datetime === null) {
            this.props.onDateTimeChange(this.state.selected, this.props.name, this.state.isValid, this.props.id);
            // }
        })
    }

    onChangeRaw = (event) => {
        // let tempVal = !isEmpty(event.target.value) ? Moment(event.target.value, this.props.showTimeSelectOnly ? this.props.timeFormat : !this.props.showTimeSelectOnly ? this.props.dateFormat : "dd/MM/yyyy") : ""
        this.setState({

            // date: this.props.showTimeSelectOnly && tempVal.isValid() ? tempVal._i : tempVal
            date: Moment(this.props.value)
            // }
            // , () => {
            //     this.props.onDateTimeChange(tempVal, this.props.name, this.state.isValid, this.props.id);
        })
    }

    onSelect = () => {
        this.props.onSelect(Moment(this.props.value, 'DD/MM/YYYY'), this.props.name)
    }

    prevIndex = (name) => { if (this.props.prevIndex) { this.props.prevIndex(name); } }

    keyDownDate = (e) => {
        const keyCode = e.keyCode || e.which;
        if (keyCode === 9) {
            if (e.shiftKey) { this.prevIndex(e.target.name); e.preventDefault(); }
        }
    }

    handleBlur = (event) => {
        let value = event.target.value;

        let formattedDate = Moment(value, "DD/MM/YYYY HH:mm");

        if (this.props.showYearPicker)
            formattedDate = Moment(value, "YYYY");

        if (this.props.showTimeSelectOnly)
            formattedDate = Moment(value, this.props.timeFormat ? this.props.timeFormat : "HH:mm");

        let checkMaxMin = true
        let checkError = true;

        if (this.props.maxDate) {
            if (formattedDate.isAfter(this.props.maxDate)) {
                checkMaxMin = false
            }
        }

        if (this.props.minDate) {
            if (formattedDate.format("YYYY/MM/DD") < Moment(this.props.minDate).format("YYYY/MM/DD")) {
                checkMaxMin = false
            }
        }

        this.setState({
            isValid: (formattedDate.isValid() || value === "") && checkError && checkMaxMin ? true : false
        }, () => {
            this.props.onDateTimeChange((value === "" ? "" : formattedDate), this.props.name, this.state.isValid ? true : false, this.props.id ? this.props.id : "")
        });

    }

    // ! check if the component will have the x to clear the date input 
    checkIfClearable = () => {
        if (this.props.disabled) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <div >
                {/* <DatePicker
                    ref={this.textInput}
                    customInput={
                        <DateTimeInputMask mask={this.props.allowTime ? this.props.dateSlash ? '99/99/9999 hr:mn' : '99-99-9999 hr:mn ap' : "99/99/9999"}
                            formatChars={{
                                '9': '[0-9]', 'h': '[0-2]', 'r': '[0-9]', 'm': '[0-5]', 'n': '[0-9]',
                                'a': '[Aa,Pp]', 'p': '[Mm]'
                            }}
                            maskChar={null} />
                    }
                    dateFormat={`dd/MM/yyyy${this.props.allowTime ? " HH:mm" : ""}`}
                    key={this.props.key ? this.props.key : undefined}
                    locale="en-gb"
                    value={this.state.date}
                    onChange={this.onDateChange}
                    selected={this.state.selected && this.state.isValid ? this.state.selected._d : null}
                    onChangeRaw={this.onChangeRaw}
                    showMonthDropdown
                    showYearDropdown
                    showTime={true}
                    timeFormat="HH:mm"
                    style={{
                        width: "100%",
                        padding: '0'
                    }}
                    timeIntervals={60}
                    showTimeSelect={this.props.allowTime}
                    className={`form-control ${this.props.allowTime ? "" : "text-center"} ${this.props.className}`}
                    minDate={this.props.minDate ? Moment(this.props.minDate) : undefined}
                    maxDate={this.props.maxDate ? Moment(this.props.maxDate) : undefined}
                    isClearable={this.checkIfClearable()}
                    onBlur={this.props.onBlur ? this.props.onBlur : this.handleBlur}
                    onKeyDown={this.keyDownDate}
                    placeholderText={this.props.placeholder}
                    todayButton="Today"
                    dropdownMode="select"
                    readOnly={this.props.readOnly ? true : false}
                    disabled={this.props.disabled ? true : false}
                    popperPlacement={this.props.popperPlacement}
                /> */}
                <DatePicker
                    ref={this.textInput}

                    id={this.props.id}
                    name={this.props.name}
                    placeholderText={this.props.placeholder}
                    tabindex={this.props.tabindex}
                    readOnly={this.props.readOnly ? true : false}
                    disabled={this.props.disabled ? true : false}
                    timeIntervals={this.props.timeIntervals ? this.props.timeIntervals : 60}

                    value={this.state.date}
                    selected={this.state.selected && this.state.isValid ? this.state.selected._d : null}
                    onChange={this.onDateChange}
                    onChangeRaw={this.onChangeRaw}
                    onSelect={this.props.onSelect ? this.props.onSelect : null}


                    tabIndex={this.props.tabIndex}
                    key={this.props.key ? this.props.key : undefined}
                    // locale="en-gb"
                    dropdownMode="select"

                    dateFormat={this.props.dateFormat ? this.props.dateFormat : "dd/MM/yyyy"}
                    timeFormat={this.props.timeFormat ? this.props.timeFormat : "HH:mm"}

                    showMonthDropdown
                    showYearDropdown
                    showTime={this.props.showTime ? true : false}
                    showMonthYearPicker={this.props.showMonthYearPicker ? true : false}
                    showFullMonthYearPicker={this.props.showFullMonthYearPicker ? true : false}
                    showFourColumnMonthYearPicker={this.props.showFourColumnMonthYearPicker ? true : false}
                    useShortMonthInDropdown={this.props.useShortMonthInDropdown ? true : false}
                    showTimeSelect={this.props.showTimeSelect ? true : false}
                    showTimeSelectOnly={this.props.showTimeSelectOnly ? true : false}
                    showYearPicker={this.props.showYearPicker ? true : false}

                    todayButton="Today"
                    className={`form-control ${this.props.mandatory || this.props.invalid ? "alert-danger" : ""} ${this.props.dateClassNames} ${this.props.allowTime ? "" : "text-center"}`}
                    style={{ width: "100%", padding: '0', border: `${this.props.mandatory || this.props.invalid ? "1px solid red" : ""}` }}
                    isClearable={this.props.clearable} // date component should always be clearable, if component is disabled, on pressing X value will be changed
                    onBlur={this.props.onBlur ? this.props.onBlur : this.handleBlur}
                    popperClassName={this.props.popperClassName}
                    minDate={this.props.minDate ? this.props.minDate._d : undefined}
                    maxDate={this.props.maxDate ? this.props.maxDate._d : undefined}
                    customInput={
                        <DateTimeInputMask mask={this.props.dateTimeMask ? this.props.dateTimeMask : this.props.allowTime ? this.props.dateSlash ? '99/99/9999 hr:mn' : '99-99-9999 hr:mn ap' : "99/99/9999"}
                            formatChars={{
                                '9': '[0-9]', 'h': '[0-2]', 'r': '[0-9]', 'm': '[0-5]', 'n': '[0-9]',
                                'a': '[Aa,Pp]', 'p': '[Mm]'
                            }}
                            maskChar={null} />
                    }
                />
            </div>
        );
    }
}

export default DateTimePickerComp;