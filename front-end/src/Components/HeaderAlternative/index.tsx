import React from 'react'
import * as C from './styles'
import {  useSelector } from 'react-redux'
import logo from '../../imgs/logo2.png'

export default function HeaderAlternative() {

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    return (
        <C.Container darkMode={darkMode}>

            <div className='logo'>
                <a href='/'><img src={logo} alt='AniProject Logo' id='logo'></img></a>
            </div>

        </C.Container>
    )
}
