import React from 'react'
const style = {
    'display': 'block',
    'position': 'absolute',
    'top': '0px',
    'left': '0px',
    'width': '100%',
    'height': '100%',
    'backgroundColor': 'rgba(0, 0, 0, 0.5)',
    'zIndex': '9999',
    'opacity': '0.8'
}

export function Loader({ show, message, backgroundStyle }) {
    return (

        <div style={{ ...style, 'display': `${show ? 'block' : 'none'}` }}
        >
            {message}
        </div >



    )


}
