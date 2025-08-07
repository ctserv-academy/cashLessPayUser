import React from 'react';
import "./Support.css"

class Support extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {

        return (
            <div id="supportMainContainer">
             <h3 className='pageTitle'>Support</h3>
             For support please call <a href="tel:+961 79 18 18 18">+961 79 18 18 18</a>
            </div >
        );
    }
}

export default Support;