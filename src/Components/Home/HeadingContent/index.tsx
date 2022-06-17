import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'

interface props {
    data: any
    item?: any
}

export default function HeadingContent(data: any) {

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

        <C.AnimeFromHeading headingContent={data.data} >

            <div className='item-about'>
                <div className='item-info'>
                    <Link to={`/${format}/${data.data.id}`}><h1>{data.data.title.romaji}</h1></Link>
                    <h2>{data.data.title.native}</h2>
                </div>

                <div className='item-button'>
                    <Link to={`/${format}/${data.data.id}`}>See More</Link>
                    <button type='button' onClick={() => console.log(data.data)}><PlusSvg /></button>
                </div>
            </div>

        </C.AnimeFromHeading>
    )
}
