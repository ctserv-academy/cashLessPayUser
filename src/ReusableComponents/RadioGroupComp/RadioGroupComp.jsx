import React, { Component } from "react";
import { Radio, RadioGroup } from "react-icheck";
import { isEqual, map } from "lodash";
import EnhancedSwitch from 'react-icheck/lib/EnhancedSwitch'
import PropTypes from 'prop-types';
import './radioGroupComp.css'

class RadioGroupComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value
        };
        EnhancedSwitch.propTypes = {
            ...EnhancedSwitch.propTypes,
            cursor: PropTypes.string
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)) {
            return true;
        } else {
            return false
        }
    }

    componentDidUpdate(prevProps) {

        if (!isEqual(prevProps.value, this.props.value)) {
            this.setState({ value: this.props.value })
        }
    }
    handleChange = (e) => {
        let { value, name } = e.target
        this.setState({ value }, () => {
            this.props.onClick(this.state.value, name, this.props.id ? this.props.id : "")
        })
    }

    renderRadio = (radios) => {
        let HTML = []
        map(radios, (value, key) => {
            HTML.push(
                <Radio
                    cursor="pointer"
                    key={key}
                    value={value.value}
                    name={value.name}
                    className="col-12"
                    radioClass="iradio_square-blue"
                    increaseArea={`${this.props.increaseArea ? "20%" : null}`}
                    disabled={this.props.disabled ? true : false}
                    label={
                        `<span
                     style='${this.props.styleHTMLLabel}; padding: 0 20px 0 0;' 
                     class='${this.props.radioClassname ? this.props.radioClassname : ""}'>
                 ${value.name}</span>`
                    } />)
        })

        return HTML;
    }
    render() {
        return (
            <div className={this.props.removeMargin ? "radio-button-main-container" : ""}>
                <RadioGroup
                    name={this.props.name}
                    value={this.state.value}
                    className={this.props.className + (this.props.isNotRowRadioGroup ? "" : "row")}
                    style={this.props.style}
                    onChange={this.handleChange}
                >
                    {this.renderRadio(this.props.radios)}
                </RadioGroup>
            </div>
        );
    }
}

export default RadioGroupComp;
