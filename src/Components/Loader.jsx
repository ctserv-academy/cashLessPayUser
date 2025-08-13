import React from 'react'
import { Spinner } from 'reactstrap'
export default function Loader() {
    return (
        <div className='loading-page'>
            <Spinner color="primary"
                style={{
                    height: '5rem',
                    width: '5rem',
                    position: 'absolute',
                    top: '50%'
                }}
            />


        </div>
    )
}
