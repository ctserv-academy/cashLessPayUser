import React, { Component } from "react";
import { isEqual } from "lodash";
import { FormGroup, Input } from "reactstrap";

class SwitchComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.checked
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
        if (!isEqual(prevProps.checked, this.state.checked) || !isEqual(prevProps.checked, this.props.checked)) {
            this.setState({ checked: this.props.checked })
        }
    }
    onSwitchChange = (key) => e => {
        this.setState({ checked: e.target.checked }, () => {
            this.props.onSwitchChange(this.state.checked, key)
        })
    }
    render() {
        return (
            <FormGroup switch>
                <Input
                    type="switch"
                    cursor="pointer"
                    checked={this.state.checked ? true : false}
                    onChange={this.onSwitchChange(this.props.name)}
                    disabled={this.props.disabled ? true : false}
                    readOnly={this.props.readOnly ? true : false}
                // style={this.props.style ? this.props.style : ""}
                />
                <label style={this.props.labelBold ? { fontWeight: '600' } : this.props.style}>{this.props.label}</label>
                {/* <label style={this.props.styles}>{this.props.label}</label> */}
                {/* <label>{this.props.labelBold ? <b>{this.props.label}</b> : this.props.label}</label> */}


            </FormGroup>
        );
    }
}

export default SwitchComponent;
