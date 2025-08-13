import React from 'react'
import { NavLink } from 'react-router-dom'

export function BreadCrumbItem({ children, label, path, separator, isDisabledStyle = undefined }) {
    return (
        <>
            < NavLink to={path} style={isDisabledStyle} >{children ? children : label}</NavLink>
            <span> {separator} </span>
        </>

    )
}
