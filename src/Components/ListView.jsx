import React from 'react'
export default function ListView({ documents, onLviClick, ...rest }) {
    return (
        <div className="container-fluid">
            {documents.length > 0 &&
                <div className="row">
                    {
                        documents.map((eachElem, key) => {
                            return (
                                //  className="col-xs-12 col-md-6 col-lg-3 mt-5 " 
                                <div key={"image-" + key} style={{ float: "left", marginRight: "5px", width: "fit-content" }}>
                                    <img src={eachElem.Doc_PngImg} onClick={onLviClick(eachElem, key)}
                                        width="300" height="auto" alt='' className='listview-item' />
                                    <div style={{ textAlign: "-webkit-center" }}>
                                        {`${eachElem.Doc_PatCaseNo ? `Case# ${eachElem.Doc_PatCaseNo}` : `MRN ${JSON.parse(localStorage.getItem('patientData')).medicalFile}`}`}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }


        </div>
    )
}
