import React, { MouseEventHandler, useId } from 'react'
import styles from './component.module.css'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Link from 'next/link'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'

type SearchResultsTypes = {

    handleChoseResult?: MouseEventHandler<HTMLDivElement>,
    mediaFromAnilist?: ApiDefaultResult,
    mediaFromOfflineDB?: MediaDbOffline

}

function SearchResultItemCard({ handleChoseResult, mediaFromAnilist, mediaFromOfflineDB }: SearchResultsTypes) {

    const elementId = useId()

    // change title color to the informed on Item Data when hovered
    function changeHeadingColor(isHovering: boolean) {

        const el = document.getElementById(elementId)!.getElementsByTagName('h5')[0].getElementsByTagName('a')[0]

        if (isHovering) return el!.style.color = mediaFromAnilist?.coverImage?.color || 'var(--white-100)'

        el!.style.color = 'var(--white-100)'

        return

    }

    return (
        <li
            id={elementId}
            className={styles.result_container}
            onMouseEnter={() => { changeHeadingColor(true) }}
            onMouseLeave={() => { changeHeadingColor(false) }}
        >

            <div
                className={styles.image_container}
                onClick={handleChoseResult}
            >
                <Link href={`/media/${mediaFromAnilist?.id || mediaFromOfflineDB?.anilistId}`}>
                    <Image
                        src={mediaFromAnilist?.coverImage?.large || mediaFromAnilist?.coverImage?.medium || mediaFromOfflineDB?.picture || mediaFromOfflineDB?.thumbnail}
                        alt={`Cover Art for ${mediaFromAnilist?.title.userPreferred}`}
                        fill
                        sizes='90px'
                    ></Image>
                </Link>
            </div>

            <div className={styles.result_info_container}>
                
                <h5 onClick={handleChoseResult}>
                    <Link href={`/media/${mediaFromAnilist?.id || mediaFromOfflineDB?.anilistId}`}>
                        {mediaFromAnilist?.title.userPreferred ? mediaFromAnilist.title.userPreferred : (mediaFromAnilist?.title?.romaji || mediaFromOfflineDB?.title || `No Title`)}
                    </Link>
                </h5>

                <div>

                    {mediaFromAnilist?.genres && (
                        <ul className={`display_flex_row ${styles.genres_container}`}>
                            {mediaFromAnilist.genres.slice(0, 3).map((item: string, key) => (
                                <li key={key}>
                                    <Link href={`/genre/${item.toLowerCase()}`}>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    {mediaFromOfflineDB?.tags && (
                        <ul className={`display_flex_row ${styles.genres_container}`}>
                            {mediaFromOfflineDB.tags.slice(0, 3).map((item: string, key) => (
                                <li key={key}>
                                    <Link href={`/genre/${item.toLowerCase()}`}>
                                        {item.slice(0, 1).toUpperCase() + item.slice(1)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className={`${styles.width_flex} display_flex_row`}>

                        <p>
                            <span style={{ color: "var(--error)" }}>
                                {mediaFromAnilist?.isAdult && "+18"}
                            </span>
                            {mediaFromAnilist?.type ? mediaFromAnilist.type : mediaFromOfflineDB?.type || 'No Type Defined'}
                        </p>

                        {mediaFromAnilist?.startDate != undefined ? (
                            <small>
                                {mediaFromAnilist.type == 'ANIME' && 'First aired in '}
                                {mediaFromAnilist.type == 'MANGA' && 'Published in '}
                            </small>
                        ) : (
                            <small>
                                {mediaFromOfflineDB?.animeSeason.year || "No Date Available"}
                            </small>
                        )}

                    </div>
                </div>
            </div>

        </li >
    )
}

export default SearchResultItemCard