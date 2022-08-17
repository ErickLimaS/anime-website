/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import * as C from './styles'
import { ReactComponent as EyeSvg } from '../../imgs/svg/eye-fill.svg'
import { ReactComponent as EyeSlashSvg } from '../../imgs/svg//eye-slash-fill.svg'
import { ReactComponent as BookMarkEpisodeSvg } from '../../imgs/svg/bookmark-plus.svg'
import { ReactComponent as BookMarkFillEpisodeSvg } from '../../imgs/svg/bookmark-check-fill-2.svg'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { addEpisodeToAlreadyWatched, addEpisodeToBookmarks, removeEpisodeFromAlreadyWatched, removeEpisodeFromBookmarks } from '../../redux/actions/userActions'

export default function EpisodesAniList(props: any) {

    const [isWatched, setIsWatched] = useState<boolean>(false)
    const [onBookmarks, setOnBookmarks] = useState<boolean>(false)

    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    // dark mode
    const darkModeSwitch = useSelector((state: any) => state.darkModeSwitch)
    const { darkMode } = darkModeSwitch

    useEffect(() => {

        //check if the current media is currently added to user account
        if (userInfo) {
            userInfo.episodesAlreadyWatched.find((item: any) => {
                if (item.id === props.media.id) {
                    item.episodes.find((item2: any) => {
                        if (item2.episodeId === props.data.title.replace(/!|#|,/g, ``).replace(/ /g, `-`)) {
                            setIsWatched(true)
                        }
                    })
                }
            })
            userInfo.episodesBookmarked.find((item: any) => {
                if (item.id === props.media.id) {
                    item.episodes.find((item2: any) => {
                        if (item2.episodeId === props.data.title.replace(/!|#|,/g, ``).replace(/ /g, `-`)) {
                            setOnBookmarks(true)
                        }
                    })
                }
            })
        }


    }, [])

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
                    'id': props.media.id,
                    'fullTitle': props.media.title.romaji,
                    'nativeTitle': props.media.title.native && props.media.title.native,
                    'coverImg': props.media.coverImage.medium && props.media.coverImage.medium,
                    'type': props.media.type,
                    'status': props.media.status,
                    'fromGoGoAnime': Boolean(false),
                    'episodes': {
                        'episodeId': props.data.title.replace(/!|#|,/g, ``).replace(/ /g, `-`),
                        'episodeName': props.data.title,
                        'originSite': 'AniList',
                        'thumbnail': props.data.bannerImage,
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

                'id': props.media.id,
                'fromGoGoAnime': Boolean(false),
                'episodes': {
                    'episodeId': props.data.title.replace(/!|#|,/g, ``).replace(/ /g, `-`),
                }

            }))

            setIsWatched(false)

        }

    }

    const handleBookmarkEpisode = () => {

        //CHECKS if dont has on user account
        if (onBookmarks === false) {

            if (userInfo) {

                dispatch(addEpisodeToBookmarks({
                    'addedAt': new Date(),
                    'id': props.media.id,
                    'fullTitle': props.media.title.romaji,
                    'nativeTitle': props.media.title.native && props.media.title.native,
                    'coverImg': props.media.coverImage.medium && props.media.coverImage.medium,
                    'type': props.media.type,
                    'status': props.media.status,
                    'fromGoGoAnime': Boolean(false),
                    'episodes': {
                        'episodeId': props.data.title.replace(/!|#|,/g, ``).replace(/ /g, `-`),
                        'episodeName': props.data.title,
                        'originSite': 'AniList',
                        'thumbnail': props.data.bannerImage,
                        'title': 'none',
                    }
                }))

                setOnBookmarks(true)

            }
            else {

                navigate(`/login?redirect=${currentUrlToRedirect.slice(1, currentUrlToRedirect.length)}`)

            }

        }
        else {

            //remove dispatch 
            dispatch(removeEpisodeFromBookmarks({

                'id': props.media.id,
                'fromGoGoAnime': Boolean(false),
                'episodes': {
                    'episodeId': props.data.title.replace(/!|#|,/g, ``).replace(/ /g, `-`),
                }

            }))

            setOnBookmarks(false)

        }

    }

    return (
        <C.Container
            darkMode={darkMode}
        >

            <a href={`${props.data.url}`} target='_blank' rel='noreferrer'>
                <img src={`${props.data.thumbnail}`} alt={`${props.data.title}`}></img>
            </a>
            <a href={`${props.data.url}`} target='_blank' rel='noreferrer'>
                <h3>{props.data.title}</h3>
            </a>

            <C.Buttons isWatched={isWatched} onBookmarks={onBookmarks}>
                {isWatched ? (
                    <button type='button' className='isWatched' onClick={() => handleEpisodeWatched()}><EyeSvg /></button>
                ) : (
                    <button type='button' className='isWatched' onClick={() => handleEpisodeWatched()}><EyeSlashSvg /></button>
                )}
                {onBookmarks ? (
                    <button type='button' className='onBookmarks' onClick={() => handleBookmarkEpisode()}><BookMarkFillEpisodeSvg /></button>
                ) : (
                    <button type='button' className='onBookmarks' onClick={() => handleBookmarkEpisode()}><BookMarkEpisodeSvg /></button>
                )}
            </C.Buttons>

        </C.Container>
    )
}
