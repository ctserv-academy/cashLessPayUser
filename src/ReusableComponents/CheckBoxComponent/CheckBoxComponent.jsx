import React, { Component } from "react";
import { Checkbox } from "react-icheck";
import { isEqual } from "lodash";
import EnhancedSwitch from 'react-icheck/lib/EnhancedSwitch'
import PropTypes from 'prop-types';
import './checkBoxComponent.css'

class CheckBoxComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.checked
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
        if (!isEqual(prevProps.checked, this.state.checked) || !isEqual(prevProps.checked, this.props.checked)) {
            // if (!isEqual(prevProps.checked, this.props.checked)) {
            this.setState({ checked: this.props.checked })
        }
    }

    onCheckChange = (key) => e => {
        this.setState({ checked: e.target.checked }, () => {
            this.props.onCheckChange(this.state.checked, key)
        })
    }
    render() {
        return (
            <Checkbox
                cursor="pointer"
                checkboxClass={`${this.props.checkboxClassName ? this.props.checkboxClassName : "icheckbox_square-blue"}${this.props.className ? " " + this.props.className : ""}`}
                increaseArea={this.props.increaseArea ? "20%" : ""}
                checked={this.state.checked ? true : false}
                onChange={this.onCheckChange(this.props.name)}
                label={this.props.description ? `<span style='margin:0px 20px 0px 7px'> ${this.props.description} </span>` : "<span></span>"}
                disabled={this.props.disabled ? true : false}
                readOnly={this.props.readOnly ? true : false}
                style={this.props.style ? this.props.style : ""}
            />
        );
    }
}

export default CheckBoxComp;
