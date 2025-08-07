import React from 'react';
import "./TermsAndConditions.css"

class TermsAndConditions extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {


        return (
            <div id="termsAndConditionsMainContainer">
                <h3 className='pageTitle'style={{marginBottom:"20px"}}>Terms And Conditions</h3>
                <p>This card is the poroprty of Petmart and must returned upon request.</p>
                <p>The use of this card is governed by Petmart terms and conditions.</p>
                <p>If found return to any branch near you.</p>
                <p>To report loss or theft notify any branch near you or call 
                <a href="tel:+96179181818">+961 79 181818</a></p>
            </div >
        );
    }
}

export default TermsAndConditions;