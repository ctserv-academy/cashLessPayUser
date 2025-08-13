import React, { Component } from 'react'
import './tooltipComp.css'
import { Tooltip } from 'reactstrap'

class TooltipComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tooltipVisible: false
        }
    }

    toggleTooltip = () => {
        this.setState({
            tooltipVisible: !this.state.tooltipVisible
        })
    }

    render() {
        return (
            <Tooltip
                placement={this.props.placement}
                isOpen={this.state.tooltipVisible}
                autohide={this.props.autohide}
                target={this.props.target}
                toggle={this.props.toggle}
                trigger={this.props.trigger}
            >
                <div> {this.props.tooltipDesc}</div>
            </Tooltip>
        )
    }
}
export default TooltipComp;
