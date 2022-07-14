/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as EyeSvg } from '../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../imgs/svg//eye-slash-fill.svg'
import { ReactComponent as BookMarkEpisodeSvg } from '../../imgs/svg/bookmark-plus.svg'
import { ReactComponent as BookMarkFillEpisodeSvg } from '../../imgs/svg/bookmark-check-fill-2.svg'
import { useDispatch, useSelector } from 'react-redux'
import { addEpisodeToAlreadyWatched, removeEpisodeFromAlreadyWatched } from '../../redux/actions/userActions'
import { useNavigate } from 'react-router'

export default function EpisodesGoGoAnime(props: any) {

    const [isWatched, setIsWatched] = useState<boolean>(false)
    const [onBookmarks, setOnBookmarks] = useState<boolean>(false)
    const [videoId, setVideoId] = useState<string>()
    const [episodeActive, setEpisodeActive] = useState<boolean>(false)

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {

        //check if the current media is currently added to user account
        if (userInfo) {
            userInfo.episodesAlreadyWatched.find((item: any) => {
                if (item.idGoGoAnime === props.mediaTitle) {
                    item.episodes.find((item2: any) => {
                        if (item2.episodeId === props.data.episodeId) {
                            setIsWatched(true)
                        }
                    })
                }
            })
            userInfo.episodesBookmarked.find((item: any) => {
                if (item.idGoGoAnime === props.mediaTitle) {
                    item.episodes.find((item2: any) => {
                        if (item2.episodeId === props.data.episodeId) {
                            setOnBookmarks(true)
                        }
                    })
                }
            })
        }


        if (videoId == props.data.episodeNum) {
            setEpisodeActive(true)
        }

    }, [props.data.episodeId, props.data.episodeNum, props.mediaTitle, userInfo, videoId])

    const dispatch: any = useDispatch()
    const navigate: any = useNavigate()

    //store current media url to redirect if user is not logged in
    const currentUrlToRedirect = window.location.pathname

    const handleEpisodeWatched = () => {

        //CHECKS if dont has on user account
        if (isWatched === false) {

            if (userInfo) {

                dispatch(addEpisodeToAlreadyWatched({
                    'addedAt': new Date(),
                    'idGoGoAnime': props.media.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`),
                    'fullTitle': props.media.animeTitle,
                    'nativeTitle': props.media.otherNames && props.data.otherNames,
                    'coverImg': props.media.animeImg && props.media.animeImg,
                    'type': props.media.type,
                    'status': props.media.status,
                    'fromGoGoAnime': Boolean(true),
                    'episodes': {
                        'episodeId': props.data.episodeId,
                        'episodeName': props.data.episodeNum,
                        'originSite': 'GoGoAnime',
                        'thumbnail': 'none',
                        'title': 'none',
                    }
                }))

                setIsWatched(true)

            }
            else {

                navigate(`/login?redirect=${currentUrlToRedirect.slice(1, currentUrlToRedirect.length)}`)

            }

        }
        else {

            //remove dispatch 
            dispatch(removeEpisodeFromAlreadyWatched({

                'idGoGoAnime': props.media.animeTitle.replace(/!|#|,/g, ``).replace(/ /g, `-`),
                'fromGoGoAnime': Boolean(true),
                'episodes': {
                    'episodeId': props.data.episodeId,
                }

            }))

            setIsWatched(false)

        }

    }

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

            <C.Buttons isWatched={isWatched} onBookmarks={onBookmarks}>
                {isWatched ? (
                    <button type='button' className='onBookmarks' onClick={() => handleEpisodeWatched()}><EyeSvg /></button>
                ) : (
                    <button type='button' className='onBookmarks' onClick={() => handleEpisodeWatched()}><EyeSlashSvg /></button>
                )}
                {onBookmarks ? (
                    <button type='button' className='onBookmarks' onClick={() => console.log(`s`)}><BookMarkFillEpisodeSvg /></button>
                ) : (
                    <button type='button' className='onBookmarks' onClick={() => console.log(`s`)}><BookMarkEpisodeSvg /></button>
                )}
            </C.Buttons>

        </C.Container>
    )
}
