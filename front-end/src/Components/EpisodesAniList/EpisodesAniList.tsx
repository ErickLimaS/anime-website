import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as EyeSvg } from '../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../imgs/svg//eye-slash-fill.svg'
import { ReactComponent as BookMarkEpisodeSvg } from '../../imgs/svg/bookmark-plus.svg'
import { ReactComponent as BookMarkFillEpisodeSvg } from '../../imgs/svg/bookmark-check-fill-2.svg'

export default function EpisodesAniList({ data }: any) {

    const [isWatched, setIsWatched] = useState<boolean>(false)
    const [onWatchList, setOnWatchList] = useState<boolean>(false)

    useEffect(() => {

        //condition if watched or not

    }, [])

    return (
        <C.Container>

            <a href={`${data.url}`} target='_blank' rel='noreferrer'>
                <img src={`${data.thumbnail}`} alt={`${data.title}`}></img>
            </a>
            <a href={`${data.url}`} target='_blank' rel='noreferrer'>
                <h3>{data.title}</h3>
            </a>

            <C.Buttons isWatched={isWatched} onWatchList={onWatchList}>
                {isWatched ? (
                    <button type='button' className='isWatched' onClick={() => console.log(`s`)}><EyeSvg /></button>
                ) : (
                    <button type='button' className='isWatched' onClick={() => console.log(`s`)}><EyeSlashSvg /></button>
                )}
                {onWatchList ? (
                    <button type='button' className='onWatchList' onClick={() => console.log(`s`)}><BookMarkFillEpisodeSvg /></button>
                ) : (
                    <button type='button' className='onWatchList' onClick={() => console.log(`s`)}><BookMarkEpisodeSvg /></button>
                )}
            </C.Buttons>

        </C.Container>
    )
}
