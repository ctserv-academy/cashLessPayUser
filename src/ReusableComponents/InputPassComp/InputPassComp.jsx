import React, { Component } from 'react';
import { isEqual } from "lodash";
import Tooltip from "../../reactstrap/Tooltip"
import './inputPassComp.css'

class InputPassComp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            showPassword: false,
            showTooltip: false
        };
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
        const { value } = e.target;

        this.setState({
            value: value
        }, () => {
            this.props.handleChange(this.state.value, this.props.name)
        })
    }

    togglePasswordVisibility = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    toggleTooltip = () => {
        this.setState({
            showTooltip: !this.state.showTooltip
        })
    }
    onBlur = (e) => {
        this.setState({
            value: e.target.value.trim()
        }, () => {
            this.props.handleChange(this.state.value, this.props.name);
            this.props.handleOnblur && this.props.handleOnblur(this.state.value, this.props.name);
        })
    }
    render() {

        return (
            <div className="passwordComp" style={{ position: "relative" }}>
                <input
                    type={this.state.showPassword ? "text" : "password"}
                    name={this.props.name}
                    style={{ padding: "0.5rem 1.5rem 0.5rem 0.75rem" }}
                    className={`form-control ${this.props.className}`}
                    value={this.state.value}
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder}
                    readOnly={this.props.readOnly ? true : false}
                    disabled={this.props.disabled ? true : false}
                    maxLength={this.props.maxLength ? this.props.maxLength : null}
                    onBlur={this.onBlur}
                />
                {!this.props.hideToggle &&
                    <span className="showPass pointer" id={`${this.props.name}-showhidePass`} onClick={this.togglePasswordVisibility} style={{ position: "absolute", top: "0px", right: "0px", padding: "0.45rem 0.3rem" }}>
                        <i className={`fa fa-eye${this.state.showPassword ? "-slash" : ""}`}></i>
                        <Tooltip placement="bottom" isOpen={this.state.showTooltip} target={`${this.props.name}-showhidePass`} toggle={this.toggleTooltip}>{this.state.showPassword ? "Hide Password" : "Show Password"}</Tooltip>
                    </span>
                }
            </div>
        );
    }
}

export default InputPassComp;
