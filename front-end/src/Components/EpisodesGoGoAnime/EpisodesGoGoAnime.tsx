import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as EyeSvg } from '../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../imgs/svg//eye-slash-fill.svg'
import { ReactComponent as BookMarkEpisodeSvg } from '../../imgs/svg/bookmark-plus.svg'
import { ReactComponent as BookMarkFillEpisodeSvg } from '../../imgs/svg/bookmark-check-fill-2.svg'
import gogoAnime from '../../API/gogo-anime'

export default function EpisodesGoGoAnime(props: any) {

    const [isWatched, setIsWatched] = useState<boolean>(false)
    const [onWatchList, setOnWatchList] = useState<boolean>(false)
    const [videoId, setVideoId] = useState<string>()
    const [episodeActive, setEpisodeActive] = useState<boolean>(false)

    useEffect(() => {

        //condition if watched or not


        if (videoId == props.data.episodeNum) {
            setEpisodeActive(true)
        }

    }, [props.data.episodeNum, videoId])

    return (
        <C.Container
            episodeActive={episodeActive}
        >

            <button
                className='episode-button'
                onClick={() => props.streamingLink(props.data.episodeId) && setVideoId(props.data.episodeNum)}
            >
                <h3>Episode {props.data.episodeNum}</h3>
            </button>

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
