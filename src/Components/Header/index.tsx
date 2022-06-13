import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as ListSvg } from '../../imgs/svg/list.svg'
import SearchInnerPage from '../SearchInnerPage'

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

                    <h3>Category</h3>

                    <ul>

                        <li><Link to={``}>Shonen</Link></li>
                        <li><Link to={``}>Shojo</Link></li>
                        <li><Link to={``}>Seinen</Link></li>
                        <li><Link to={``}>Sports</Link></li>
                        <li><Link to={``}>Action</Link></li>

                    </ul>

                    <h3>Categories</h3>

                    <ul>

                        <li><Link to={``}>Tv</Link></li>
                        <li><Link to={``}>Manga</Link></li>
                        <li><Link to={``}>One Shot</Link></li>
                        <li><Link to={``}>Novel</Link></li>
                        <li><Link to={``}>Movie</Link></li>
                        <li><Link to={``}>Special</Link></li>
                        <li><Link to={``}>OVA</Link></li>

                    </ul>
                </nav>

            </div>

        </C.Container>
    )
}
