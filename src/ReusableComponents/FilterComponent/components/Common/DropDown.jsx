import { useOutsideClick } from '../../hooks/useOutsideClick';
import React, { useRef } from 'react'
import { useLayoutEffect } from 'react';
import '../mainFilter.css'
import './DropDown.css'

export default function DropDown({ controlId, dropDownOptions, dropDownValueChanged, isOpen, toggle, ...rest }) {

    const myRef = useRef(null);

    useOutsideClick(myRef, () => {
        if (isOpen)
            toggle(false)
    }, isOpen);

    useLayoutEffect(() => {

        if (!isOpen)
            return


        const control = document.getElementById(controlId);
        control.style.position = 'relative'

        const contextMenu = document.getElementById(`${controlId}_dropDown`);
        // contextMenu.style.display = 'none'
        // contextMenu.style.opacity = 0
        const buttonRect = control.getBoundingClientRect();
        const buttonX = buttonRect.left;
        const buttonY = buttonRect.top;
        // Position the context menu near the button
        const menuX = buttonX + 10; // add an offset to the right
        const menuY = buttonY + buttonRect.height; // add an offset below
        contextMenu.style.left = `${menuX}px`;
        contextMenu.style.top = `${menuY}px`;
        contextMenu.style.display = 'block';
        // contextMenu.style.opacity = 1



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
        <>
            {isOpen &&
                <div ref={myRef} className='drop-down-container' id={`${controlId}_dropDown`}>
                    <div className='drop-down-container-div'>
                        <div>  </div>
                        <div className='drop-down-arrow' />

                        <ul className='drop-down-ul' >
                            {dropDownOptions.map(v => {
                                return <li key={v.replaceAll(' ', '')} className='drop-down-li' onClick={
                                    (event) => {
                                        event.stopPropagation();
                                        dropDownValueChanged(v)
                                        toggle(false)
                                    }}>
                                    {v}
                                </li>
                            })}

                        </ul>
                    </div>


                </div>
            }
        </>


    )
}
