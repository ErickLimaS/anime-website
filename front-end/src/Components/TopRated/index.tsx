import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import Score from '../Score';

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
        case 'NOVEL':
            format = 'novel';
            break;
        case 'SPECIAL':
            format = 'special';
            break;
        case 'ONE_SHOT':
            format = 'one-shot';
            break;
        case 'OVA':
            format = 'ova';
            break;
        case 'ONA':
            format = 'ona';
            break;
        case 'TV_SHORT':
            format = 'tv-short';
            break;
        default:
            format = 'anime'; //fix exception
            break;
    }

    return (

        <C.TopRatedAnime info={data.data} >
            <Link to={`/${format}/${data.data.id}`}>
                <div className='anime-name'>
                    <h2>{data.data.title.romaji} <span>({data.data.startDate.year})</span></h2>
                </div>
            </Link>
        </C.TopRatedAnime>
    )
}
