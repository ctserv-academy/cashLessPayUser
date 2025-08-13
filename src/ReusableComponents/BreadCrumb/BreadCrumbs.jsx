import React, { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BreadCrumbItem } from './BreadCrumbItem';
import './breadCrumbs.css'

export function BreadCrumbs({ routes, renderFunction = undefined, separator = '/', isDisabledStyle = undefined }) {
    const location = useLocation();
    const [locationRoutes, setlocationRoutes] = useState([]);
    const o = {
        path: '',
        label: ''
    }
    const extractPath = useCallback((path) => {

        let pathArr = [];
        let pathObjArr = [];

        if (path.length - 1 !== path.lastIndexOf("/")) {
            path += "/";
        }
        while (path.includes("//")) {
            path = path.replace('//', '/')
        }
        while (path.length !== 0) {
            let subpath = path.substring(0, path.lastIndexOf("/"))
            pathArr.push(subpath === '' ? '/' : subpath)
            path = path.substring(0, path.lastIndexOf("/"))
        }

        pathArr.reverse();

        pathObjArr = pathArr.map(elem => {
            let route = routes?.find(e => e.path.toLowerCase() === elem.toLowerCase());
            return { ...o, path: elem, label: route ? route.breadcrumb : elem }
        })

        return pathObjArr


    }, [o])

    useEffect(() => {
        let path = location.pathname;
        let pathObjArr = extractPath(path);
        let renderedJSX = []
        if (!renderFunction) {
            renderedJSX = pathObjArr.map(elem => {
                let isActive = elem.path === location.pathname
                return <BreadCrumbItem label={elem.label} path={elem.path} separator={separator} isDisabledStyle={isDisabledStyle({ isActive: isActive })} />
            })
        }
        else {

            let rJSX = pathObjArr.map(renderFunction);
            renderedJSX = pathObjArr.map(elem => {
                let isDisabled = elem.path === location.pathname

                return <BreadCrumbItem
                    key={pathObjArr.indexOf(elem)}
                    children={rJSX.at(pathObjArr.indexOf(elem))}
                    label={elem.label} path={elem.path} separator={separator}
                    isDisabledStyle={isDisabledStyle({ isDisabled: isDisabled })} />
            })

        }
        setlocationRoutes(renderedJSX);

    }, [location.pathname])

    return (
        <div className="breadcrumb">{locationRoutes}</div>
    )
}
