import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import parse from "html-react-parser"
import AddToPlaylistButton from '../AddToPlaylistButton'

function CardMediaCoverAndDescription({ data, customDescription, showButtons }: { data: ApiDefaultResult, customDescription?: string, showButtons?: boolean }) {
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
                    <span className={styles.paragrath_container}>
                        {customDescription || parse(data?.description) || "Description Not Available"}
                    </span>
                )}

                {showButtons == undefined && (
                    <div className={styles.buttons_container}>

                        <Link href={`/media/${data.id}`}>{data.format == "MANGA" ? "READ" : "WATCH"} NOW</Link>

                        <AddToPlaylistButton data={data} />

                    </div>
                )}

            </div>

        </div>
    )

}

export default CardMediaCoverAndDescription