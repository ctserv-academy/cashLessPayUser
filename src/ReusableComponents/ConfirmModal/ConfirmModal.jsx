import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import './confirmModal.css'

export default function ConfirmModal({ visible, defaultIconClose, onCloseConfirm, ModalTitle, ModalText, ModalTextAccept, ModalTextRefused, ModalTextClose, hideSaveButton, onAccept, onRefused, className, ...props }) {

  const toggleModal = () => {
    if (defaultIconClose) {
      defaultIconClose(false)
    }
    else {
      onCloseConfirm()
    }
  }



  return (
    <Modal isOpen={visible} className={className} backdrop="static">
      <ModalHeader >{ModalTitle}</ModalHeader>
      <ModalBody>
        {ModalText}
      </ModalBody>
      <ModalFooter>
        {/* pass the hideSaveButton as true to hide all the save button  */}
        {!hideSaveButton && < Button color="custom" onClick={onAccept}>{ModalTextAccept || "Save"}</Button>}{' '}
        {ModalTextRefused && onRefused &&
          <Button color="warning" onClick={onRefused}>{ModalTextRefused}</Button>
        }
        <Button color="danger" onClick={onCloseConfirm}>{ModalTextClose || "Close"}</Button>
      </ModalFooter>
    </Modal >
  )
}
