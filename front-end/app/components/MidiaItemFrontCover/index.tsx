import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'

function MidiaItemCoverInfo({ positionIndex, data, darkMode }: any) {

    return (

        <div
            id={styles.midia_item_cover}
            className={`${styles.midia_item_container} ${darkMode ? styles.darkMode : ''}`}
            style={{ gridArea: `item${positionIndex}` }}
        >
            <Link id={styles.img_container} href={`/media/${data.id}`}>
                <Image src={data.coverImage.extraLarge} alt={`Cover Art for ${data.title.romaji}`} fill></Image>
            </Link>

            <small>{(data.seasonYear && (`${data.seasonYear}, `))} {data.genres && data.genres[0]}</small>

            <Link href={`/media/${data.id}`}>{data.title.romaji}</Link>
        </div>
    )

}

export default MidiaItemCoverInfo