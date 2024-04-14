import React, { MouseEventHandler, useId } from 'react'
import styles from './component.module.css'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Link from 'next/link'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'

function SearchResultItemCard({ onClick, itemAnilist, itemOfflineDb }: { onClick?: MouseEventHandler<HTMLDivElement>, itemAnilist?: ApiDefaultResult, itemOfflineDb?: MediaDbOffline }) {

    const id = useId()

    // change title color to the informed on Item Data when hovered
    function addHoverEffect(e: React.MouseEvent<HTMLLIElement, MouseEvent>, isHovering: boolean) {

        const el = document.getElementById(id)!.getElementsByTagName('h5')[0].getElementsByTagName('a')[0]

        if (isHovering) {
            el!.style.color = itemAnilist?.coverImage?.color || 'var(--white-100)';
            return
        }

        el!.style.color = 'var(--white-100)';
        return
    }

    return (
        <li id={id} className={styles.result_container} onMouseEnter={(e) => { addHoverEffect(e, true) }} onMouseLeave={(e) => { addHoverEffect(e, false) }} >

            <div
                className={styles.image_container}
                onClick={onClick}
            >
                <Link href={`/media/${itemAnilist?.id || itemOfflineDb?.anilistId}`}>
                    <Image
                        src={itemAnilist?.coverImage?.large || itemAnilist?.coverImage?.medium || itemOfflineDb?.picture || itemOfflineDb?.thumbnail}
                        alt={`Cover Art for ${itemAnilist?.title.romaji}`}
                        fill
                        sizes='90px'
                    ></Image>
                </Link>
            </div>

            <div className={styles.result_info_container}>
                <h5 onClick={onClick}><Link href={`/media/${itemAnilist?.id || itemOfflineDb?.anilistId}`}>
                    {itemAnilist?.title.romaji ? itemAnilist.title.romaji : (itemAnilist?.title?.romaji || itemOfflineDb?.title || `No Title`)}</Link>
                </h5>

                <div>
                    {itemAnilist?.genres != undefined && (
                        <ul className={`display_flex_row ${styles.genres_container}`}>
                            {itemAnilist.genres.slice(0, 3).map((item: string, key: number) => (
                                <li key={key}><Link href={`/genre/${item.toLowerCase()}`}></Link>{item}</li>
                            ))}
                        </ul>
                    )}
                    {itemOfflineDb?.tags != undefined && (
                        <ul className={`display_flex_row ${styles.genres_container}`}>
                            {itemOfflineDb.tags.slice(0, 3).map((item: string, key: number) => (
                                <li key={key}><Link href={`/genre/${item.toLowerCase()}`}></Link>{item.slice(0, 1).toUpperCase() + item.slice(1)}</li>
                            ))}
                        </ul>
                    )}

                    <div className={`${styles.width_flex} display_flex_row`}>
                        <p>
                            <span style={{ color: "var(--error)" }}>
                                {itemAnilist?.isAdult && "+18"}
                            </span>
                            {itemAnilist?.type ? itemAnilist.type : itemOfflineDb?.type || 'No Type Defined'}
                        </p>
                        {itemAnilist?.startDate != undefined ? (
                            <small>
                                {itemAnilist.type == 'ANIME' && 'First aired in '}
                                {itemAnilist.type == 'MANGA' && 'Published in '}
                                {itemAnilist.type == 'MOVIE' && 'First aired in '}
                                {itemAnilist.startDate && (
                                    <>
                                        {itemAnilist.startDate.month && itemAnilist.startDate.month.toString() + '/' || ''}
                                        {itemAnilist.startDate.day && itemAnilist.startDate.day.toString() + '/' || ''}
                                        {itemAnilist.startDate.year && itemAnilist.startDate.year.toString()}
                                    </>
                                )}
                            </small>
                        ) : (
                            <small>{itemOfflineDb?.animeSeason.year}</small>
                        ) || (
                            <small>No Date Available</small>
                        )}
                    </div>
                </div>
            </div>

        </li >
    )
}

export default SearchResultItemCard