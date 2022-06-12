import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import Score from '../../Score'


export default function Trending(data: any) {

    const score = data.data.averageScore / 2

    console.log(data.data)

    return (

        <C.AnimeToBeListed info={data.data} >

            <div className='cover'>
                <Link to={`/anime/${data.data.id}`}>
                    <img src={`${data.data.coverImage.large}`} alt={data.data.title.romaji}></img>
                </Link>
            </div>

            <div className='info'>
                <Link to={`/anime/${data.data.id}`}><h3>{data.data.title.romaji}</h3></Link>
                <div className='genre'>
                    <ul>
                        {(data.data.genres).slice(0, 3).map((item: any) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className='score'>
                    <Score data={score} />
                </div>
            </div>

        </C.AnimeToBeListed>
    )
}
