"use client"
import React, { useLayoutEffect, useState } from 'react'
import styles from "./component.module.css"
import Link from 'next/link'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import news from '@/api/news'
import { News } from '@/app/ts/interfaces/newsInterface'
import SvgCalendar from "@/public/assets/calendar3.svg"
import Image from 'next/image'

function AnimeNavListHover() {

    const [animeData, setAnimeData] = useState<News[]>()

    const loadData = async () => {

        const data = await news.getNews() as News[]

        setAnimeData(data)

    }

    useLayoutEffect(() => {
        loadData()
    }, [])

    return (
        <div id={styles.news_header_nav_container}>

            <div className={styles.link_container}>
                <Link href={`/news`}>Go to News Page</Link>
            </div>

            <ul data-loading={animeData == undefined}>

                {animeData ? (

                    animeData.slice(0, 10).map((item, key) => (
                        <li key={key}>

                            <div className={styles.image_container}>
                                <Link href={`/news/${item.id.replace(/\/?daily-briefs\//, "") }`}>
                                    <Image fill src={item.thumbnail} alt={item.title}></Image>
                                </Link>
                            </div>

                            <div className={styles.title_container}>

                                <h5><Link href={`/news/${item.id.replace(/\/?daily-briefs\//, "") }`}>{item.title}</Link></h5>

                                <small><SvgCalendar width={16} height={16} alt="Calendar" /> {item.uploadedAt}</small>

                            </div>

                        </li>
                    ))
                ) : (
                    <LoadingSvg width={200} height={200} alt="Loading" />
                )}

            </ul>
        </div>
    )
}

export default AnimeNavListHover