import React, { useId } from 'react'
import styles from './component.module.css'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Link from 'next/link'

function SearchResultItemCard({ item }: { item: ApiDefaultResult }) {

    const id = useId()

    // change title color to the informed on Item Data when hovered
    function addHoverEffect(e: React.MouseEvent<HTMLLIElement, MouseEvent>, isHovering: boolean) {

        const el = document.getElementById(id)!.getElementsByTagName('h5')[0].getElementsByTagName('a')[0]

        if (isHovering) {
            el!.style.color = item.coverImage.color || 'var(--white-100)';
            return
        }

        el!.style.color = 'var(--white-100)';
        return
    }

    return (
        <li id={id} className={styles.result_container} onMouseEnter={(e) => { addHoverEffect(e, true) }} onMouseLeave={(e) => { addHoverEffect(e, false) }} >

            <div className={styles.image_container}>
                <Link href={`/media/${item.id}`}>
                    <Image src={item.coverImage.large} alt={`Cover Art for ${item.title.romaji}`} fill ></Image>
                </Link>
            </div>

            <div className={styles.result_info_container}>
                <h5><Link href={`/media/${item.id}`}>{item.title.romaji ? item.title.romaji : (item.title.romaji || `No Title`)}</Link></h5>

                <div>
                    {item.genres != undefined && (
                        <ul className={`display_flex_row ${styles.genres_container}`}>
                            {item.genres.slice(0, 3).map((item: string, key: number) => (
                                <li key={key}><Link href={`/genre/${item.toLowerCase()}`}></Link>{item}</li>
                            ))}
                        </ul>
                    )}

                    <div className={`${styles.width_flex} display_flex_row`}>
                        <p>{item.type ? item.type : 'No Type Defined'}</p>
                        {item.startDate != undefined ? (
                            <small>
                                {item.type == 'ANIME' && 'First aired in '}
                                {item.type == 'MANGA' && 'Published in '}
                                {item.type == 'MOVIE' && 'First aired in '}
                                {item.startDate && (
                                    <>
                                        {item.startDate.month && item.startDate.month.toString() + '/' || ''}
                                        {item.startDate.day && item.startDate.day.toString() + '/' || ''}
                                        {item.startDate.year && item.startDate.year.toString()}
                                    </>
                                )}
                            </small>
                        ) : (
                            <small>No Date Available</small>
                        )}
                    </div>
                </div>
            </div>

        </li >
    )
}

export default SearchResultItemCard