import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'

function MediaItemCoverInfo({ positionIndex, data, darkMode, loading }: { data: ApiDefaultResult, positionIndex?: number, darkMode?: boolean, loading?: boolean }) {

    return (

        <div
            id={styles.midia_item_cover}
            className={`${styles.midia_item_container} ${darkMode ? styles.darkMode : ''}`}
            style={{ gridArea: `item${positionIndex}` }}
            data-loading={loading || false}
        >
            <Link id={styles.img_container} href={`/media/${data.id}`}>
                <Image src={data.coverImage && data.coverImage.large} alt={`Cover Art for ${data.title && data.title.romaji || "dsa"}`} fill></Image>
            </Link>

            <small>{(data.seasonYear && (`${data.seasonYear}, `))} {data.genres && data.genres[0]}</small>

            <Link href={`/media/${data.id}`}>{data.title && data.title.romaji}</Link>
        </div>
    )

}

export default MediaItemCoverInfo