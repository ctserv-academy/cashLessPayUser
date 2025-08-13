import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import './modalComp.css'

export function ModalComp({ modalTitle, modalBody, onAcceptColor, onRefusedColor, onCloseColor, onAcceptText, onRefusedText,
    onCloseText, onAccept, onRefused, onClose, className, modal, size, hideFooterButtons }) {

    const [mdl, setModal] = useState(false)

    useEffect(() => {
        if (mdl !== modal) {
            setModal(modal)
        }
    }, [modal, mdl])

    return (

        <div onKeyDown={(e) => { if (e.keyCode === 27) onClose && onClose() }}>
            <Modal size={size ? size : ""}
                isOpen={mdl} className={"reset-modal-style " + className}
                toggle={onClose}
                backdrop="static">
                <ModalHeader id="custom-modal-header" >{modalTitle}</ModalHeader>
                <ModalBody id="custom-modal-body">
                    {modalBody}
                </ModalBody>
                {
                    !hideFooterButtons &&
                    <ModalFooter id="custom-modal-footer">
                        {onAccept &&
                            <Button color={onAcceptColor || "info"} onClick={onAccept}>{onAcceptText || "Save"}</Button>
                        }
                        {onRefused &&
                            <Button color={onRefusedColor || "warning"} onClick={onRefused}>{onRefusedText || "Refused"}</Button>
                        }
                        {onClose &&
                            <Button color={onCloseColor || "danger"} onClick={onClose}>{onCloseText || "Close"}</Button>
                        }
                    </ModalFooter>
                }
            </Modal>
        </div>
    )
}
