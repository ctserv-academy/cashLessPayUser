import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import { isEqual } from "lodash";
import './textAreaComp.css'

class TextAreaComp extends Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.value };
    }

    componentDidMount() { }

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
        const { value } = e.target;
        this.setState({ value }, () => {
            this.props.onChange(this.state.value, this.props.name)
        })
    }

    onBlur = e => {
        this.setState({ value: e.target.value.trim() }, () => {
            this.props.onChange(this.state.value, this.props.name)
        })
    }
    render() {

        return (
            <div>
                <TextareaAutosize
                    onChange={this.handleChange}
                    name={this.props.name}
                    value={this.state.value}
                    placeholder={this.props.placeholder ? this.props.placeholder : ""}
                    className={`form-control ${this.props.className}`}
                    style={{ ...this.props.style }}
                    maxLength={this.props.maxLength ? this.props.maxLength : 5000}
                    onBlur={this.onBlur}
                    disabled={this.props.disabled ? true : false}
                    aria-label="maximum height"
                    maxRows={this.props.maxRows}
                />
            </div>
        );
    }
}

export default TextAreaComp;
