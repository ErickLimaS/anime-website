"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import * as MediaInfoExpanded from '@/app/components/MediaCards/MediaInfoExpandedWithCover'
import Link from 'next/link'
import anilist from '@/app/api/anilistMedias'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import { animesGenres } from '../../index'
import ErrorPlaceholder from '../ErrorPlaceholder'

function AnimeNavListHover() {

    const [animeData, setAnimeData] = useState<ApiDefaultResult[] | null>([])

    useEffect(() => { fetchAnimeList() }, [])

    async function fetchAnimeList() {

        const animeList: ApiDefaultResult[] = await anilist.getMediaForThisFormat({ type: "ANIME" }) as ApiDefaultResult[]

        setAnimeData(animeList)

    }

    if (!animeData) {

        return <ErrorPlaceholder />

    }

    return (
        <ul id={styles.anime_header_nav_container}>
            <li>
                <div id={styles.anime_card_container}>
                    <h5>Anime of the Day</h5>

                    {animeData.length > 0 ? (
                        <MediaInfoExpanded.Container mediaInfo={animeData[0]} >

                            <MediaInfoExpanded.Description
                                description={animeData[0].description}
                            />

                            <MediaInfoExpanded.Buttons
                                media={animeData[0]}
                                mediaFormat={animeData[0].format}
                                mediaId={animeData[0].id}
                            />

                        </MediaInfoExpanded.Container>
                    ) : (
                        <LoadingSvg />
                    )}
                </div>

                <div id={styles.anime_genres_container}>
                    <h5>Anime Genres</h5>

                    <ul>
                        {animesGenres.map((genre) => (
                            <li key={genre.value}>
                                <Link href={`/search?type=tv&genre=[${genre.value}]`}>
                                    {genre.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h5>Anime Trailer You May Like</h5>

                    {(animeData.length > 0 && animeData[animeData.length - 1]?.trailer?.id) ? (
                        <iframe
                            className="yt_embed_video"
                            src={`https://www.youtube.com/embed/${animeData[animeData.length - 1].trailer.id} `
                            }
                            frameBorder={0}
                            title={animeData[animeData.length - 1].title.userPreferred + " Trailer"}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                            allowFullScreen
                        />
                    ) : (
                        <LoadingSvg />
                    )}
                </div>
            </li>
        </ul>
    )
}

export default AnimeNavListHover