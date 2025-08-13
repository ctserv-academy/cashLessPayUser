import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { Tooltip } from 'reactstrap';
import "./buttonsContainer.css"

export function ButtonsContainer({ handleButtonClick, createdBy, creationDate, modifiedBy, showClose, showSave, showPrint,
    showDelete, showCopy, showSaveAndSign, showSaveAsDraft, showClear, showStart, showSendEmail, showSendReminder, outsideClick, modifiedDate }) {
    const STATE = {
        createdBy: '',
        creationDate: '',
        modifiedBy: '',
        modifiedDate: '',

        showClose: false,
        showSave: false,
        showDelete: false,
        showPrint: false,
        showCopy: false,
        showSaveAsDraft: false,
        showSaveAndSign: false,
        showClear: false,
        showStart: false,
        showSendEmail: false,
        showSendReminder: false,

        tooltip: {
            save: false,
            print: false,
            copy: false,
            delete: false,
            saveAsDraft: false,
            saveAndSign: false,
            clear: false,
            close: false,
            start: false,
            sendMail: false,
            sendReminder: false,
            reject: true,
        },
        outsideClick: true
    }
    const [state, setState] = useState(STATE)



    useEffect(() => {
        setState({
            ...STATE, createdBy: createdBy ? createdBy : "",
            creationDate: creationDate ? creationDate : "",
            modifiedBy: modifiedBy ? modifiedBy : "",
            modifiedDate: modifiedDate ? modifiedDate : "",
            showClose: showClose ? showClose : false,
            showSave: showSave ? showSave : false,
            showPrint: showPrint ? showPrint : false,
            showDelete: showDelete ? showDelete : false,
            showCopy: showCopy ? showCopy : false,
            showSaveAndSign: showSaveAndSign ? showSaveAndSign : false,
            showSaveAsDraft: showSaveAsDraft ? showSaveAsDraft : false,
            showClear: showClear ? showClear : false,
            showStart: showStart ? showStart : false,
            showSendEmail: showSendEmail ? showSendEmail : false,
            showSendReminder: showSendReminder ? showSendReminder : false,
            outsideClick: outsideClick ? outsideClick : false
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createdBy, creationDate, modifiedBy, showClose, showSave, showDelete, showPrint, showCopy, showSaveAndSign, showSaveAsDraft, showClear, showStart, showSendEmail, showSendReminder, outsideClick]);


    const handleSubComponentClick = useCallback((name) => (e) => {
        handleButtonClick(name);
    }, [handleButtonClick])


    const toggleTooltip = useCallback((_name) => (event) => {
        setState(previousState => {
            return {
                ...previousState,
                tooltip: {
                    ...previousState.tooltip,
                    [_name]: !previousState.tooltip[_name]
                },
                outsideClick: previousState.outsideClick && previousState.tooltip[_name]
            }
        })
    }, [])

    return (
        <div className="buttonsContainer">
            <div className="row no-margin">
                <div className="col-md-6">


                    <small>
                        {state.createdBy && <>Created by {state.createdBy} on {moment(state.creationDate).format("DD MMMM YYYY")}</>}
                        {state.createdBy && state.modifiedBy && <>&nbsp;-&nbsp;</>}
                        {state.modifiedBy && <>Last edited By {state.modifiedBy} on {moment(state.modifiedDate).format("DD MMMM YYYY")}</>}
                    </small>

                </div>
                <div className="col-md-6 text-right no-padding">
                    {
                        state.showClose &&
                        <button id="close" className="topIcons" type="button" onClick={handleSubComponentClick("close")}>
                            <i className="fa fa-times"></i>
                            <span>Cancel</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.close} target="close" toggle={toggleTooltip("close")}>Cancel</Tooltip>
                        </button>
                    }
                    {
                        state.showSaveAndSign &&
                        <button id="saveAndSign" className="topIcons" type="button" onClick={handleSubComponentClick("saveAndSign")}>
                            <i className="fa fa-pencil-square-o save" style={{ color: "#3399ff" }}></i>
                            <span>Save And Sign</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.saveAndSign} target="saveAndSign" toggle={toggleTooltip("SaveAndSign")}>Save And Sign</Tooltip>
                        </button>
                    }
                    {
                        state.showSaveAsDraft &&
                        <button id="saveAsDraft" className="topIcons" type="button" onClick={handleSubComponentClick("saveAsDraft")}>
                            <i className="fa fa-floppy-o save"></i>
                            <span>Save as Draft</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.saveAsDraft} target="saveAsDraft" toggle={toggleTooltip("SaveAsDraft")}>Save as Draft</Tooltip>
                        </button>
                    }
                    {
                        state.showSave &&
                        <button id="save" className="topIcons" type="button" onClick={handleSubComponentClick("save")}>
                            <i className="fa fa-floppy-o save"></i>
                            <span>Save</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.save} target="save" toggle={toggleTooltip("save")}>Save</Tooltip>
                        </button>
                    }
                    {
                        state.showPrint &&
                        <button id="print" className="topIcons" type="button" onClick={handleSubComponentClick("print")}>
                            <i className="fa fa-print"></i>
                            <span>Print</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.print} target="print" toggle={toggleTooltip("print")}>Print</Tooltip>
                        </button>
                    }
                    {
                        state.showDelete &&
                        <button id="delete" className="topIcons" type="button" onClick={handleSubComponentClick("delete")}>
                            <i className="fa fa-trash"></i>
                            <span>Delete</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.delete} target="delete" toggle={toggleTooltip("delete")}>Delete</Tooltip>
                        </button>
                    }
                    {
                        state.showCopy &&
                        <button id="copy" className="topIcons" type="button" onClick={handleSubComponentClick("copy")}>
                            <i className="fa fa-print"></i>
                            <span>Copy</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.copy} target="copy" toggle={toggleTooltip("copy")}>Copy</Tooltip>
                        </button>
                    }
                    {
                        state.showClear &&
                        <button id="clear" type="button" className="topIcons" onClick={handleSubComponentClick("clear")}>
                            <i className="fa fa-undo"></i>
                            <span>Undo</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.clear} target="clear" toggle={toggleTooltip("clear")}>Undo</Tooltip>
                        </button>
                    }
                    {
                        state.showSendReminder &&
                        <button id="sendReminder" type="button" className="topIcons" onClick={handleSubComponentClick("sendReminder")}>
                            <i className="fa fa-bell reminder"></i>
                            <span>Send Reminder</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.sendReminder} target="sendReminder" toggle={toggleTooltip("sendReminder")}>Send Reminder</Tooltip>
                        </button>
                    }
                    {
                        state.showSendEmail &&
                        <button id="sendMail" type="button" className="topIcons" onClick={handleSubComponentClick("sendMail")}>
                            <i className="fa fa-envelope email"></i>
                            <span>Send Mail</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.sendMail} target="sendMail" toggle={toggleTooltip("sendMail")}>Send Mail</Tooltip>
                        </button>
                    }
                    {
                        state.showStart &&
                        <button id="start" type="button" className="topIcons" onClick={handleSubComponentClick("start")}>
                            <i className="fa fa-play-circle play_circle"></i>
                            <span>Start</span>
                            <Tooltip placement="bottom" isOpen={!state.outsideClick && state.tooltip.start} target="start" toggle={toggleTooltip("start")}>Start</Tooltip>
                        </button>
                    }

                </div>
            </div>
        </div>
    )
}
