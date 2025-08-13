import React, { useEffect, useState } from 'react'
import { SearchControlsList } from './SearchControlsList';
import './searchControls.css'

export function SearchControls({ SearchDictionary }) {

    const [data, setData] = useState(SearchDictionary);
    const [filteredData, setFilteredData] = useState([])
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if (!keyword) {
            setFilteredData([]);
        }
        else {
            setFilteredData(data.filter(e => e.Description.toLowerCase().includes(keyword.toLowerCase())));
        }
    }, [keyword])


    return (
        <div>
            <h2>
                Search
            </h2>
            <input placeholder='Type to Search For Components' value={keyword} onChange={(e) => {
                setKeyword(e.target.value)
            }} />
            <SearchControlsList filteredData={filteredData} />



        </div>
    )
}
