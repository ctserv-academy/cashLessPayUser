import React from 'react';
import { Link } from 'react-router-dom';

import "./AppNav.css"

class AppNav extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        return (
            <div id="appNavMainContainer"  className={this.props.isAppNavVisile?"isNavOpen":"isNavClosed"} >
                <div>
                    <Link to="/Profile">
                        Profile
                    </Link>
                </div>

                <div>
                    <Link to="/TermsAndConditions">
                        Terms And Conditions
                    </Link>
                </div>

                <div>
                    {/* <Link > */}
                    <a href="http://ctserv.net/#/privacypolicy/petmartslb" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                    {/* </Link> */}

                </div>
                
                <div>
                    <Link to="/Support">
                        Support
                    </Link>
                </div >

                {/* <div>
                    <Link>
                        signout
                    </Link>
                </div > */}
            </div >
        );
    }
}

export default AppNav;