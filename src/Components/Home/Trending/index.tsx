import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import * as C from './styles'
import { ReactComponent as PlusSvg } from '../../../imgs/svg/plus.svg'
import { ReactComponent as StarSvg } from '../../../imgs/svg/star.svg'
import { ReactComponent as StarFillSvg } from '../../../imgs/svg/star-fill.svg'
import { ReactComponent as StarHalfSvg } from '../../../imgs/svg/star-half.svg'


export default function Trending(data: any) {

    console.log(data.data)

    const score = data.data.averageScore / 2

    return (

        <C.AnimeToBeListed info={data.data} >

            <div className='cover'>
                <img src={`${data.data.coverImage.large}`} alt={data.data.title.romaji}></img>
            </div>

            <div className='info'>
                <h3>{data.data.title.romaji}</h3>
                <div className='genre'>
                    <ul>
                        {(data.data.genres).slice(0, 3).map((item: any) => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                <div className='score'>
                    {score === 50 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                        </>
                    )}
                    {score >= 45 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarHalfSvg />
                        </>
                    )}
                    {score >= 40 && score < 45 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarSvg />
                        </>
                    )}
                    {score >= 35 && score < 40 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarHalfSvg />
                            <StarSvg />
                        </>
                    )}
                    {score >= 30 && score < 35 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarSvg />
                            <StarSvg />
                        </>
                    )}
                    {score >= 25 && score < 30 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarHalfSvg />
                            <StarSvg />
                            <StarSvg />
                        </>
                    )}
                    {score >= 20 && score < 25 && (
                        <>
                            <StarFillSvg />
                            <StarFillSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </>
                    )}
                    {score >= 15 && score < 20 &&(
                        <>
                            <StarFillSvg />
                            <StarHalfSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </>
                    )}
                    {score >= 10 && score < 15 && (
                        <>
                            <StarFillSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </>
                    )}
                    {score < 10 && (
                        <>
                            <StarHalfSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                            <StarSvg />
                        </>
                    )}
                </div>
            </div>

        </C.AnimeToBeListed>
    )
}
