import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import MovieSvg from "@/public/assets/film.svg"
import AnimeSvg from "@/public/assets/play-circle.svg"
import MangaSvg from "@/public/assets/book.svg"
import MusicSvg from "@/public/assets/music-note-beamed.svg"

type ComponentTypes = {
    data: ApiDefaultResult,
    positionIndex?: number,
    darkMode?: boolean,
    loading?: boolean,
    hiddenOnDesktop?: boolean
}

function MediaItemCoverInfo({ positionIndex, data, darkMode, loading, hiddenOnDesktop }: ComponentTypes) {
    return (

        <div
            id={styles.midia_item_cover}
            className={`${styles.midia_item_container} ${darkMode ? styles.darkMode : ''} ${hiddenOnDesktop ? styles.midia_item_container_hidden : ""}`}
            style={{ gridArea: `item${positionIndex}` }}
            data-loading={loading || false}
        >
            <Link id={styles.img_container} href={`/media/${data.id}`}>
                <Image
                    src={data.coverImage && data.coverImage.large}
                    alt={`Cover Art for ${data.title && data.title.romaji || "dsa"}`}
                    fill
                    sizes='100%'
                    title={data.title.romaji || data.title.native}
                ></Image>
                <span className={styles.media_type_icon}>

                    {(data.format == "OVA" || data.format == "TV" || data.format == "ONA" || data.format == "SPECIAL") && <AnimeSvg width={16} height={16} alt="Tv Icon" />}
                    {(data.format == "MOVIE") && <MovieSvg width={16} height={16} alt="Movie Icon" />}
                    {(data.format == "MANGA") && <MangaSvg width={16} height={16} alt="Manga Icon" />}
                    {(data.format == "MUSIC") && <MusicSvg width={16} height={16} alt="Music Icon" />}

                </span>
            </Link>

            <small>{(data.seasonYear && (`${data.seasonYear}, `))} {data.genres && data.genres[0]}</small>

            <Link href={`/media/${data.id}`}>{data.title && data.title.romaji}</Link>
        </div>
    )

}

export default MediaItemCoverInfo