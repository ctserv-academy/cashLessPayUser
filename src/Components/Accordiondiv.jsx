import React from 'react'

export default function Accordiondiv({ _key, isSelected, onClicked, innerText, arcDocuments, onContextMenu, ...rest }) {
    return (
        <div onContextMenu={onContextMenu} key={'div_' + _key} className={isSelected ? "is-selected" : ''}
            onClick=
            {
                (e) => {
                    onClicked();
                }
            }
        >
            <a >
                <span>&#10148;</span>&nbsp;&nbsp;
                <span style={arcDocuments.length > 0 ? { fontWeight: 'bolder' } : null}>
                    {innerText}
                </span>
            </a>
        </div>
    )
}
