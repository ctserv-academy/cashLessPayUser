import React, { Component } from "react";
import { isEqual } from "lodash";
import RoundedIcon from "../RoundedIcon/RoundedIcon";
import './containerComp.css'

class ContainerComp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
            containerBody: this.props.containerBody
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

        if (!isEqual(prevProps.containerBody, this.props.containerBody)) {
            this.setState({ containerBody: this.props.containerBody })
        }
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    onClickPlus = () => {
        this.props.onClickPlus(this.props.name)
    }
    render() {
        return (


            <div className="col-12 border-left border-right border-bottom border-top" style={{ borderRadius: "4px" }}>
                <div className="row containerHeader">
                    <div className="col-10 no-padding-right">
                        <div className="flex title">
                            <span className="containerTitle">{this.props.containerHeader ? this.props.containerHeader : " Sample Title "}</span>
                            {this.props.addPlus &&
                                <RoundedIcon
                                    iconClass="fa-plus"
                                    iconColor="#fff"
                                    backgroundColor="#00C20C"
                                    onClick={this.onClickPlus}
                                    position="left"
                                />
                            }         </div>
                    </div>
                    <div className="col-2 text-right">
                        <div onClick={this.toggle}>
                            {this.state.isOpen ? <i className="fa fa-chevron-down pointer"></i> : <i className="fa fa-chevron-up"></i>}
                        </div>
                    </div>
                </div>
                <div className="row no-padding" style={{ display: this.state.isOpen ? "" : "none" }}>
                    <div className="col-12">
                        {this.state.containerBody}
                    </div>
                </div>
            </div>
        );
    }
}

export default ContainerComp;
