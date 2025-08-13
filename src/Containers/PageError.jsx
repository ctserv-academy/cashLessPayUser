import React, { Component } from 'react';

class PageError extends Component {

    render() {
        return (
            <div >
                <div className="container center-div" style={{ marginTop: "37vh" }}>
                    <div className="row" style={{ textAlign: "center" }}>
                        <div className="col-12">
                            <img
                                alt="favicon" style={{ objectFit: "cover", width: "200px", height: "auto" }}
                                src={process.env.PUBLIC_URL + '/img/ctservlogo.png'}>
                            </img>
                        </div>

                        <div className="col-12">
                            <h4 className="pt-1">{`Oops! Session Expired`}</h4>
                        </div>



                        <div className="col-12">
                            <p>
                                <a href={process.env.PUBLIC_URL + '/#/login'} className="a-select" style={{ cursor: "pointer", color: "#48a6d7", textDecoration: "underline" }}>
                                    Press here
                                </a> to close
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default PageError;
