import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as ListSvg } from '../../imgs/svg/list.svg'
import SearchInnerPage from '../SearchInnerPage'
import { ReactComponent as ShurikenSvg } from '../../imgs/svg/shuriken-svgrepo.svg'
import { ReactComponent as HeartsSvg } from '../../imgs/svg/hearts-svgrepo.svg'
import { ReactComponent as SwordsSvg } from '../../imgs/svg/swords-in-cross-svgrepo.svg'
import { ReactComponent as SuperPowerSvg } from '../../imgs/svg/burst-solid.svg'
import { ReactComponent as SchoolBusSvg } from '../../imgs/svg/school-bus-svgrepo1.svg'
import { ReactComponent as TvSvg } from '../../imgs/svg/tv-solid.svg'
import { ReactComponent as BallonSvg } from '../../imgs/svg/speech-balloon-svgrepo.svg'
import { ReactComponent as OneShotSvg } from '../../imgs/svg/magazines-svgrepo.svg'
import { ReactComponent as RomanceBookSvg } from '../../imgs/svg/picture-love-and-romance-svgrepo.svg'
import { ReactComponent as MovieSvg } from '../../imgs/svg/movie-player-svgrepo.svg'
import { ReactComponent as StarSvg } from '../../imgs/svg/star-fill.svg'
import { ReactComponent as OpenBookSvg } from '../../imgs/svg/open-book-svgrepo.svg'
import { ReactComponent as SettingsSvg } from '../../imgs/svg/settings-svgrepo.svg'
import { ReactComponent as BookmarkSvg } from '../../imgs/svg/bookmark-check-fill.svg'
import { ReactComponent as LogOutSvg } from '../../imgs/svg/arrow-right-from-bracket-solid.svg'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/actions/userActions'
import logo from '../../imgs/logo.png'


export default function HeaderAlternative() {

    return (
        <C.Container>

            <div className='logo'>
                <a href='/'><img src={logo} alt='AniProject Logo' id='logo'></img></a>
            </div>
            
        </C.Container>
    )
}
