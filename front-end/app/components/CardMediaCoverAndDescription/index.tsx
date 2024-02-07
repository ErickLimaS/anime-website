import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import parse from "html-react-parser"

function CardMediaCoverAndDescription({ data, showButtons }: { data: ApiDefaultResult, showButtons?: boolean }) {
    return (

        <div
            className={`${styles.midia_item_container}`}
        >
            <Link id={styles.img_container} href={`/media/${data.id}`}>
                <Image src={data.coverImage && data.coverImage.extraLarge} alt={`Cover Art for ${data.title && data.title.romaji || data.title.native}`} fill></Image>
            </Link>

            <div className={styles.item_info_container}>

                {(data.seasonYear && (
                    <small>{data.seasonYear}</small>
                ))}

                <h4><Link href={`/media/${data.id}`}>{data.title && data.title.romaji || data.title.native}</Link></h4>

                {data.description && (
                    <span className={styles.paragrath_container}>{parse(data.description)}</span>
                )}

                {showButtons == undefined && (
                    <div className={`display_flex_row ${styles.buttons_container}`}>

                        <Link href={`/media/${data.id}`}>WATCH NOW</Link>

                        <button>+ PLAYLIST</button>

                    </div>
                )}

            </div>

        </div>
    )

}

export default CardMediaCoverAndDescription