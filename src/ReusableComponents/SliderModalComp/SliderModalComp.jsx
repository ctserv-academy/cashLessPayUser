import React from 'react'
import { Button } from 'reactstrap'
import './sliderModalComp.css'

export function SliderModalComp({ sliderModalId, isSliderModalOpen, sliderModalTitle, sliderModalBody, onAcceptColor, onRefusedColor, onCloseColor, onAcceptText, onRefusedText,
    onCloseText, onAccept, onRefused, onClose, hideFooterButtons }) {

    return (
        <div id={sliderModalId} className="sliderModalCompMainContainer" style={isSliderModalOpen === true ? { display: "block" } : { display: "none" }}>
            <div className="sliderModalCompHeader">
                <h3>{sliderModalTitle}</h3>
            </div>
            <div className="sliderModalCompBody">
                {sliderModalBody}
            </div>
            {!hideFooterButtons &&
                <div className="sliderModalCompFooter">
                    {onAccept &&
                        <Button color={onAcceptColor || "info"} onClick={onAccept}>{onAcceptText || "Save"}</Button>
                    }
                    {onRefused &&
                        <Button color={onRefusedColor || "warning"} onClick={onRefused}>{onRefusedText || "Refused"}</Button>
                    }
                    {onClose &&
                        <Button color={onCloseColor || "danger"} onClick={onClose}>{onCloseText || "Close"}</Button>
                    }
                </div>
            }
        </div>
    )
}
