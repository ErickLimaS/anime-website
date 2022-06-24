import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import Score from '../../Score'


export default function Trending(data: any) {

    console.log(data.data)

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
        <>
            <C.AnimeToBeListed info={data.data} >

                <div className='cover'>
                    <Link to={`/${format}/${data.data.id}`}>
                        <img src={`${data.data.coverImage.large}`} alt={data.data.title.romaji}></img>
                    </Link>
                </div>

                <div className='info'>
                    <Link to={`/${format}/${data.data.id}`}><h3>{data.data.title.romaji}</h3></Link>
                    <div className='genre'>
                        <ul>
                            {(data.data.genres).slice(0, 3).map((item: any, key: React.Key | null | undefined) => (
                                <li key={key}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='score'>
                        <Score data={data.data.averageScore} />
                    </div>
                    <div className={`description-hover ${data.data.id}`}>

                        <span></span>
                        {data.data.description && data.data.description.length > 300 ? (
                            <p>
                                {data.data.description.slice(0, 300)}...<Link to={`/${format}/${data.data.id}`}> Read More</Link>
                            </p>
                        ) : (
                            <p>
                                {data.data.description}
                            </p>
                        )}

                    </div>
                </div>



            </C.AnimeToBeListed>

        </>
    )
}
