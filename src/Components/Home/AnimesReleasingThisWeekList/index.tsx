import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'

export default function AnimesReleasingThisWeek(data: any) {

    console.log(data.data.format) //tv, mnga, movie

    let format;

    switch (data.data.format) {
        case 'TV':
            format = 'anime';
            break;
        case 'MANGA':
            format = 'manga';
            break;
        case 'MOVIE':
            format = 'movie';
            break;
        default:
            format = 'anime'; //fix exception
            break;
    }

    return (

        <C.AnimeToBeListed info={data.data} >
            <div className='add-button'>
                <button type='button' onClick={() => console.log(data.data)}><PlusSvg /></button>
            </div>
            <div className='see-more-button'>
                <Link to={`/${format}/${data.data.id}`}>See More</Link>
            </div>
        </C.AnimeToBeListed>
    )
}
