import React, { Component, createRef } from 'react';
import './roundedIcon.css';
import TooltipComp from '../ToolTipComp/TooltipComp';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class RoundedIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id ? this.props.id.replace(/ /g, "").replace(/'/g, "", "") : "",
            tooltip: this.props.tooltip ? this.props.tooltip : "",
            popoverisVisible: false,
            tooltipVisible: false
        };

        this.wrapperRef = createRef();
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ popoverisVisible: false });
        }
    };

    toggleTooltip = () => {
        this.setState(prevState => ({
            popoverisVisible: !prevState.popoverisVisible
        }));
    };

    render() {
        let divStyles = {
            backgroundColor: this.props.backgroundColor,
            float: this.props.position === "right" || this.props.position === "left" ? this.props.position : "none",
            margin: this.props.position === 'center' ? "0 auto" : "0 0 0 5px",
            display: this.props.display ? this.props.display : "",
        };

        return (
            <div ref={this.wrapperRef} id={this.state.id}
                style={this.props.styles ? { ...divStyles, ...this.props.styles } : divStyles}
                className="roundWrapper pointer"
                onClick={this.props.onClick}
            >
                <i style={{ color: `${this.props.iconColor}`, fontSize: this.props.iconSize ?? '' }} key={this.props.iconKey ?? ''} className={`fa ${this.props.iconClass}`} />

                {this.state.id &&
                    <>
                        {this.state.tooltip &&
                            <TooltipComp placement={this.props.placement ?? "bottom"} isOpen={this.state.tooltipVisible} target={this.state.id} toggle={this.toggleTooltip} tooltipDesc={this.state.tooltip} />
                        }
                        {this.props.popover &&
                            <Popover placement={this.props.placement ?? "bottom"} isOpen={this.state.popoverisVisible} target={this.state.id} toggle={this.toggleTooltip}>
                                <PopoverHeader>{this.props.popoverHeader}</PopoverHeader>
                                <PopoverBody>
                                    <small>
                                        {this.props.popoverChildren?.length > 10 ?
                                            <div className="row">
                                                {this.props.popoverChildren?.map((val, counter) => <div className="col-6" key={counter}>{val.examDesc + "."}</div>)}
                                            </div>
                                            :
                                            this.props.popoverChildren?.map((val, counter) => <div key={counter}>{val.examDesc}</div>)
                                        }
                                    </small>
                                </PopoverBody>
                            </Popover>
                        }
                    </>
                }
            </div>
        );
    }
}

export default RoundedIcon;