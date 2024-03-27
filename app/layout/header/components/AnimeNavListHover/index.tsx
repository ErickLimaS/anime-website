"use client"
import React, { useLayoutEffect, useState } from 'react'
import styles from "./component.module.css"
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import Link from 'next/link'
import anilist from '@/api/anilist'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"

function AnimeNavListHover() {

    const [animeData, setAnimeData] = useState<ApiDefaultResult[]>()

    const loadData = async () => {

        const data = await anilist.getMediaForThisFormat("ANIME") as ApiDefaultResult[]

        setAnimeData(data)

    }

    useLayoutEffect(() => {
        loadData()
    }, [])

    return (
        <ul id={styles.anime_header_nav_container}>
            <li>
                <div id={styles.anime_card_container}>
                    <h5>Anime of the Day</h5>

                    {animeData ? (
                        <CardMediaCoverAndDescription data={animeData[0]} />
                    ) : (
                        <LoadingSvg />
                    )}
                </div>

                <div id={styles.anime_genres_container}>
                    <h5>Anime Genres</h5>

                    <ul>
                        <li><Link href={`/search?type=tv&genre=[action]`}>Action</Link></li>
                        <li><Link href={`/search?type=tv&genre=[adventure]`}>Adventure</Link></li>
                        <li><Link href={`/search?type=tv&genre=[comedy]`}>Comedy</Link></li>
                        <li><Link href={`/search?type=tv&genre=[drama]`}>Drama</Link></li>
                        <li><Link href={`/search?type=tv&genre=[sci-fi]`}>Sci-Fi</Link></li>
                        <li><Link href={`/search?type=tv&genre=[thriller]`}>Thriller</Link></li>
                        <li><Link href={`/search?type=tv&genre=[romance]`}>Romance</Link></li>
                        <li><Link href={`/search?type=tv&genre=[slice-of-life]`}>Slice of Life</Link></li>
                        <li><Link href={`/search?type=tv&genre=[mystery]`}>Mystery</Link></li>
                        <li><Link href={`/search?type=tv&genre=[sports]`}>Sports</Link></li>
                    </ul>
                </div>

                <div>
                    <h5>Anime Trailer You May Like</h5>

                    {animeData && (animeData[animeData.length - 1] as ApiDefaultResult)?.trailer?.id ? (
                        <iframe
                            className="yt_embed_video"
                            src={`https://www.youtube.com/embed/${animeData[animeData.length - 1].trailer.id} `
                            }
                            frameBorder={0}
                            title={animeData[animeData.length - 1].title.romaji + " Trailer"}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                            allowFullScreen>
                        </iframe>
                    ) : (
                        <LoadingSvg />
                    )}
                </div>
            </li>
        </ul>
    )
}

export default AnimeNavListHover