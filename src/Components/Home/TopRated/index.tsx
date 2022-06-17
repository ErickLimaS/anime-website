import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'

export default function TopRated(data: any) {

    // console.log(data.data)

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

        <C.TopRatedAnime info={data.data} >
            <Link to={`/${format}/${data.data.id}`}>
                <div className='anime-name'>
                    <h5>{data.data.title.romaji} <span>({data.data.startDate.year})</span></h5>
                </div>
            </Link>
        </C.TopRatedAnime>
    )
}
