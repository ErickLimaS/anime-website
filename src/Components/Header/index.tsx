import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as ListSvg } from '../../imgs/svg/list.svg'

export default function Header() {

    const [menuMobile, setMenuMobile] = useState(false)

    return (
        <C.Container display={menuMobile}>

            <div className='logo'>
                <a href='/'>Anime Website</a>
            </div>

            <div className='nav-links nav-links-mobile'>
                <button type='button' onClick={() => setMenuMobile(!menuMobile)}>
                    <ListSvg />
                </button>

                <nav className='mobile-display-menu-dropdown'>
                    <Link to={'/'}>Animes</Link>
                    <Link to={'/'}>Mangas</Link>
                    <Link to={'/'}>Characters</Link>
                </nav>

            </div>


        </C.Container>
    )
}
