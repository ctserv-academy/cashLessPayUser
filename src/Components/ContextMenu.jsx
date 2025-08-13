import React from 'react'

export default function ContextMenu({ contextData, toggle, toggleUploadDialog, ...rest }) {
    return (
        <div className="contextMenu" id="contextMenu">
            <div className="contextMenu--option" onClick={() => {
                toggleUploadDialog(contextData)
                toggle()
            }}>Upload Document</div>
            {/* <div className="contextMenu--option">PHP Tutorials</div>
            <div className="contextMenu--separator" />
            <div className="contextMenu--option">All Tutorials</div> */}
        </div>
    )
}
