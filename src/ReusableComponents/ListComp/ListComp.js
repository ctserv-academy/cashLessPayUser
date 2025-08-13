import React, { Component } from "react";
import { isEmpty, map } from "lodash";
import './listComp.css'

class ListComp extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <ul>
                {
                    !isEmpty(this.props.listData) &&
                    map(this.props.listData, (eachElem, key) => {
                        return <li id={"ListGroupItem-" + this.props.id ? this.props.id + "-" : "" + key}>{eachElem}</li>
                    })
                }
            </ul>
        );
    }
}

export default ListComp;