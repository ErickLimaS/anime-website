"use client"
import React, { useLayoutEffect, useState } from 'react'
import styles from "./component.module.css"
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import Link from 'next/link'
import anilist from '@/api/anilist'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"

function MangaNavListHover() {

    const [mangaData, setMangaData] = useState<ApiDefaultResult[]>()

    const loadData = async () => {
        const data = await anilist.getMediaForThisFormat("MANGA", "TRENDING_DESC") as ApiDefaultResult[]
        setMangaData(data)
    }

    useLayoutEffect(() => {
        loadData()
    }, [])

    return (
        <ul id={styles.manga_header_nav_container}>
            <li>
                <div id={styles.topics_container}>
                    <ul>
                        <li><Link href={`/filter?type=manga&sort=trending_desc`}>Trending</Link></li>
                        <li><Link href={`/filter?type=manga&sort=releases_desc`}>Lastest Releases</Link></li>
                        <li><Link href={`/filter?type=manga&genre=shounen`}>Shounen</Link></li>
                        <li><Link href={`/filter?type=manga&genre=drama`}>Genre: Drama</Link></li>
                        <li><Link href={`/filter?type=manga&genre=slice-of-life`}>Genre: Slice of Life</Link></li>
                        <li><Link href={`/filter?type=manga&genre=comedy`}>Genre: Comedy</Link></li>
                        <li><Link href={`/filter?type=manga&sort=score_desc`}>Highest Rated</Link></li>
                    </ul>
                </div>

                <div id={styles.manga_card_container}>
                    <h5>Manga of the Day</h5>

                    {mangaData ? (
                        <CardMediaCoverAndDescription data={mangaData[0]} />
                    ) : (
                        <LoadingSvg />
                    )}
                </div>

                <div id={styles.list_picked_container}>
                    <h5>Picked for you</h5>

                    {mangaData ? (
                        <ul>
                            {mangaData?.slice(1, 6).map((item, key: number) => (
                                <li key={key}>
                                    <MediaItemCoverInfo data={item} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <LoadingSvg />
                    )}
                </div>

            </li>
        </ul>
    )
}

export default MangaNavListHover