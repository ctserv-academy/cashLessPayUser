import React, { Component } from 'react';
import { isEqual } from "lodash";
// import Button from '../../reactstrap/Button'
// import { Button } from '../../reactstrap'
//import { Button } from 'reactstrap'
import './inputTextComp.css'

class InputTextComp extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
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

    handleChange = e => {
        const { value, id } = e.target;
        this.setState({ value: this.props.removeSpaces ? value.replace(" ", "") : value }, () => {
            this.props.handleChange(this.state.value, this.props.name, id ? id : "")
            if (this.props.PagingChanges) {
                this.props.PagingChanges(value)
            }
        })
    }

    onBlur = (e) => {
        this.setState({
            value: e.target.value.trim()
        }, () => {
            //this.props.handleChange && this.props.handleChange(this.state.value, this.props.name);
            this.props.handleOnblur && this.props.handleOnblur(this.state.value, this.props.name);
        })
    }
    _setinputRef = (ref) => {
        this._inputRef = ref;
    }
    focus = () => {
        if (this._inputRef) {
            return this._inputRef.focus();
        }
    }
    render() {

        return (
            <div key={this.props.name}>

                <input
                    dir={this.props.dir}
                    key={`${this.props.name}_input`}
                    ref={this._setinputRef}
                    id={this.props.id ? this.props.id : undefined}
                    type={this.props.type ? this.props.type : "text"}
                    name={this.props.name}
                    style={this.props.style}
                    className={`form-control ${this.props.className}`}
                    value={this.state.value}
                    onChange={this.handleChange}
                    placeholder={this.props.placeholder}
                    readOnly={this.props.readOnly ? true : false}
                    disabled={this.props.disabled ? true : false}
                    onBlur={this.onBlur}
                    maxLength={this.props.maxLength ? this.props.maxLength : null}
                />
            </div>
        );
    }
}

export default InputTextComp;
