import React, { Component } from "react";
import { Button } from 'reactstrap'
import "./buttonComponent.css"

class ButtonComponent extends Component {

    render() {
        return (
            <Button
                className={this.props.className ?? ''}
                color={this.props.color}
                disabled={this.props.disabled ?? false}
                onClick={this.props.onClick}
                innerRef={this.props.innerRef ?? null}
                style={this.props.style ?? null}
            >
                {this.props.description ?? 'Button'}
            </Button>
        );
    }
}

export default ButtonComponent;
