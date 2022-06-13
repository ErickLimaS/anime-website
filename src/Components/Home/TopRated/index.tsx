import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'

export default function TopRated(data: any) {

    // console.log(data.data)

    return (

        <C.TopRatedAnime info={data.data} >
            <Link to={`/anime/${data.data.id}`}>
                <div className='anime-name'>
                    <h5>{data.data.title.romaji} <span>({data.data.startDate.year})</span></h5>
                </div>
            </Link>
        </C.TopRatedAnime>
    )
}
