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
                        <li><Link href={`/filter?type=anime&genre=action`}>Action</Link></li>
                        <li><Link href={`/filter?type=anime&genre=adventure`}>Adventure</Link></li>
                        <li><Link href={`/filter?type=anime&genre=comedy`}>Comedy</Link></li>
                        <li><Link href={`/filter?type=anime&genre=drama`}>Drama</Link></li>
                        <li><Link href={`/filter?type=anime&genre=sci-fi`}>Sci-Fi</Link></li>
                        <li><Link href={`/filter?type=anime&genre=thriller`}>Thriller</Link></li>
                        <li><Link href={`/filter?type=anime&genre=romance`}>Romance</Link></li>
                        <li><Link href={`/filter?type=anime&genre=slice-of-life`}>Slice of Life</Link></li>
                        <li><Link href={`/filter?type=anime&genre=mistery`}>Mistery</Link></li>
                        <li><Link href={`/filter?type=anime&genre=sports`}>Sports</Link></li>
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