import React, { Component } from "react";
import { isEqual } from 'lodash';
import './notification.css'

class Notification extends Component {

  constructor(props) {
    super(props);

    this.state = {
      _Type: '',
      _Title: '',
      _Message: '',
      display: 'none'
    }

  }

  componentDidMount() {
    this.updateProps(this.props);
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(this.props, nextProps) || !isEqual(this.state, nextState)) {
      return true;
    } else {
      return false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      this.updateProps(this.props);
    }
  }

  updateProps = (props) => {
    this.setState({
      _Type: props.type,
      _Title: props.title,
      _Message: props.message,
      display: props.display ? props.display : "none"

    })
  }


  render() {
    return (
      <div className={`alert alert-notification ${this.state._Type === "success" || this.state._Type === "partially saved" ? "alert-success" : "alert-danger"}`}
        role="alert" style={{ display: this.state.display, textAlign:"center" }}>
        <strong>
          {this.state._Type === "success" || this.state._Type === "partially saved" ? this.state._Title ? this.state._Title : "Saved successfully" : this.state._Title ? this.state._Title : ""}{this.state._Message!=='' ? `${this.state._Message}` : '. '}
        </strong>
      </div>
    );
  }
}

export default Notification;