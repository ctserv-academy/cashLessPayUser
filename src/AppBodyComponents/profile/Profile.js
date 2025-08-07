import React from 'react';
import "./Profile.css"

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {

        return (
            <div id="profileMainContainer">
                <h3 className='pageTitle'>Profile</h3>
            </div >
        );
    }
}

export default Profile;