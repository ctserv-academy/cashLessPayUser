import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './searchControlsList.css'

const style = {

    width: '400px',
    height: '35px',
    border: '1px solid black',
    cursor: 'pointer'

}
export function SearchControlsList({ filteredData }) {

    const [data, setData] = useState([]);
    const navigate = useNavigate();



    useEffect(() => {

        setData(filteredData)
    }, [filteredData]);

    const OnItemClick = useCallback((route, elementid) => e => {
        navigate(route, { id: elementid });

    }, [])


    return (
        <div>
            <h2>{filteredData.length > 0 ? 'Search Results' : ''} </h2>
            <ul>
                {
                    filteredData.map(e => {
                        return <li>
                            <div style={style} onClick={OnItemClick(e.Route, e.id)} >
                                {e.Description + `(${e.Route})`}
                            </div>
                        </li>
                    })
                }
            </ul>

        </div>


    )
}
