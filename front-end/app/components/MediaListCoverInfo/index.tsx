import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'

function MediaListCoverInfo(
    { positionIndex, data, showCoverArt, alternativeBorder }:
        { positionIndex: number, data: ApiDefaultResult, showCoverArt?: boolean, alternativeBorder?: boolean }
) {
    return (
        <li className={styles.item_list} data-no-border={alternativeBorder}>
            {showCoverArt ? (
                <div className={styles.img_container}>
                    <Link href={`/media/${data.id}`}>
                        <Image src={data.coverImage.large} alt={`Cover Art For ${data.title.romaji}`} fill />
                    </Link>
                </div>
            ) : (
                <span className={styles.item_index}>
                    {positionIndex}
                </span>)
            }
            <div className={styles.rank_item_info}>
                <small>{data.seasonYear || "Not Available"}</small>

                <h4><Link href={`/media/${data.id}`}>{data.title && (data.title.romaji || data.title.native || "Not Available")}</Link></h4>

                {data.genres && (
                    <div className={styles.genre_container}>

                        {data.genres.slice(0, 3).map((item: String, key: number) => (
                            <small className={styles.genre} key={key}>{item}</small>
                        ))}
                    </div>
                )}

            </div>
            {alternativeBorder && (
                <span className={styles.border_bottom}></span>
            )}
        </li >
    )

}

export default MediaListCoverInfo