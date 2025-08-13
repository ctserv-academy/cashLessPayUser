import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'

export const FilterContext = createContext();

export function FilterContextWrapper({ children }) {
    const [filter, setFilter] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);

    return (
        <FilterContext.Provider value={{ filter, setFilter, selectedFilter, setSelectedFilter }} >
            {children}
        </FilterContext.Provider>
    )
}
