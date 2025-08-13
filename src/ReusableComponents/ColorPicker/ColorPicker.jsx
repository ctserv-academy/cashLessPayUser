import React, { useCallback, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { useStateWithCallback } from '../../CustomHooks/useStateWithCallback'
import './colorPicker.css'

export default function ColorPicker({ name, handleChange, color, ...props }) {

    const STATE = {
        background: '',
        name: '',
        displayColorPicker: false,
        color: {
            r: '241',
            g: '112',
            b: '19',
            a: '1',
        },

    }
    const [state, setState] = useStateWithCallback(STATE)

    useEffect(() => {
        setState(prv => {
            return {
                ...prv,
                name: name,
                background: color,
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, name])

    const handleChangeComplete = useCallback((color) => {
        setState(prv => {
            return {
                ...prv,
                background: color.hex,
            }
        }, () => {
            handleChange(color.hex, name)
        })

    }, [handleChange, name, setState])

    const handleClick = useCallback(() => {
        setState(prv => {
            return {
                ...prv,
                displayColorPicker: !state.displayColorPicker
            }
        })
    }, [state, setState])

    // const styles = reactCSS({
    //     'default': {
    //         color: {
    //        },
    //         swatch: {

    //         },
    //         popover: {

    //         },
    //         cover: {

    //         },
    //     },
    // });

    return (


        <>
            <div>
                <div style={{
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                }}
                    onClick={handleClick}>
                    <div style={{
                        width: '36px',
                        height: '14px',
                        borderRadius: '2px',
                        // background: `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})`,
                        background: state.background,
                    }} />
                </div>


                {state.displayColorPicker ?
                    <div style={{
                        position: 'absolute',
                        zIndex: '2',
                    }}>
                        <div style={{
                            position: 'fixed',
                            top: '0px',
                            right: '0px',
                            bottom: '0px',
                            left: '0px',
                        }}
                            onClick={handleClick} />
                        <SketchPicker
                            color={state.background}
                            onChangeComplete={handleChangeComplete}
                            name={props.name}
                        />

                    </div>
                    : null}

            </div>

        </>
    )
}
