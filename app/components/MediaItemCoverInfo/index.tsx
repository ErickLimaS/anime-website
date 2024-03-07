"use client"
import React, { useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import MovieSvg from "@/public/assets/film.svg"
import AnimeSvg from "@/public/assets/play-circle.svg"
import MangaSvg from "@/public/assets/book.svg"
import MusicSvg from "@/public/assets/music-note-beamed.svg"
import ErrorImg from "@/public/ERR0R_NO_IMAGE_FOUND.jpg"
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'


type ComponentTypes = {
    data: ApiDefaultResult | MediaDbOffline,
    positionIndex?: number,
    darkMode?: boolean,
    loading?: boolean,
    hiddenOnDesktop?: boolean,
    fromOfflineDb?: boolean
}

function MediaItemCoverInfo({ positionIndex, data, darkMode, loading, hiddenOnDesktop, fromOfflineDb }: ComponentTypes) {

    const customStyle = positionIndex && { gridArea: `item${positionIndex}` }

    const [imageError, setImageError] = useState(false);

    let srcImg = fromOfflineDb ?
        (data as MediaDbOffline).picture
        :
        (data as ApiDefaultResult).coverImage && (data as ApiDefaultResult).coverImage.large

    return (
        <div
            className={`${styles.media_item_container} ${darkMode ? styles.darkMode : ''} ${hiddenOnDesktop ? styles.midia_item_container_hidden : ""}`}
            style={customStyle || undefined}
            data-loading={loading || false}
        >
            <Link
                id={styles.img_container}
                className={(fromOfflineDb && (data as MediaDbOffline).anilistId == undefined) ? styles.disabled : ""}
                href={`/media/${fromOfflineDb ? (data as MediaDbOffline).anilistId : (data as ApiDefaultResult).id}`}
            >

                <Image
                    src={imageError ? ErrorImg : srcImg}
                    alt={`Cover Art for ${fromOfflineDb ? (data as MediaDbOffline).title : (data as ApiDefaultResult).title && (data as ApiDefaultResult).title.romaji || "Not Available"}`}
                    fill
                    sizes='100%'
                    onError={() => setImageError(true)}
                    title={fromOfflineDb ? (data as MediaDbOffline).title : (data as ApiDefaultResult).title.romaji || (data as ApiDefaultResult).title.native}
                ></Image>

                <span className={styles.media_type_icon}>

                    {
                        (
                            (fromOfflineDb ? (data as MediaDbOffline).type == "OVA" : (data as ApiDefaultResult).format == "OVA") ||
                            (fromOfflineDb ? (data as MediaDbOffline).type == "TV" : (data as ApiDefaultResult).format == "TV") ||
                            (fromOfflineDb ? (data as MediaDbOffline).type == "ONA" : (data as ApiDefaultResult).format == "ONA") ||
                            (fromOfflineDb ? (data as MediaDbOffline).type == "SPECIAL" : (data as ApiDefaultResult).format == "SPECIAL")
                        )
                        && <AnimeSvg width={16} height={16} alt="Tv Icon" />
                    }
                    {((fromOfflineDb ? (data as MediaDbOffline).type == "MOVIE" : (data as ApiDefaultResult).format == "MOVIE")) && <MovieSvg width={16} height={16} alt="Movie Icon" />}
                    {((fromOfflineDb ? (data as MediaDbOffline).type == "MANGA" : (data as ApiDefaultResult).format == "MANGA")) && <MangaSvg width={16} height={16} alt="Manga Icon" />}
                    {((fromOfflineDb ? (data as MediaDbOffline).type == "MUSIC" : (data as ApiDefaultResult).format == "MUSIC")) && <MusicSvg width={16} height={16} alt="Music Icon" />}

                    <span className={styles.media_format_title}>
                        {fromOfflineDb ?
                            (data as MediaDbOffline).type == "TV" ? "ANIME" : (data as MediaDbOffline).type
                            :
                            (data as ApiDefaultResult).format == "TV" ? "ANIME" : (data as ApiDefaultResult).format
                        }
                    </span>

                </span>

                {/* SHOW THAT THIS MEDIA HAS NO ID/PAGE */}
                {(fromOfflineDb && (data as MediaDbOffline).anilistId == undefined) && (
                    <span className={styles.no_page_container}>
                        No Page Found
                    </span>
                )}
            </Link>

            {
                (fromOfflineDb ?
                    (data as MediaDbOffline).animeSeason.year != undefined && (data as MediaDbOffline).tags != undefined
                    :
                    ((data as ApiDefaultResult).seasonYear != undefined && (data as ApiDefaultResult).genres != undefined)
                ) && (
                    fromOfflineDb ?

                        <small>
                            {((data as MediaDbOffline).animeSeason.year &&
                                (`${(data as MediaDbOffline).animeSeason.year}, `)
                            )}
                            {
                                (data as MediaDbOffline).tags && (data as MediaDbOffline).tags[0]?.slice(0, 1).toUpperCase()
                                +
                                (data as MediaDbOffline).tags[0]?.slice(1, (data as MediaDbOffline).tags[0].length)
                            }
                        </small>
                        :
                        <small>
                            {((data as ApiDefaultResult).seasonYear &&
                                (`${(data as ApiDefaultResult).seasonYear}, `))}
                            {(data as ApiDefaultResult).genres && (data as ApiDefaultResult).genres[0]
                            }
                        </small>

                )
            }

            <Link
                className={(fromOfflineDb && (data as MediaDbOffline).anilistId == undefined) ? styles.disabled : ""}
                href={`/media/${fromOfflineDb ? (data as MediaDbOffline).anilistId : (data as ApiDefaultResult).id}`}
            >
                {fromOfflineDb ? (data as MediaDbOffline).title : data.title && (data as ApiDefaultResult).title.romaji}
            </Link>
        </div >
    )

}

export default MediaItemCoverInfo