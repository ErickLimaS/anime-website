import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'
import MediaFormatIcon from '../MediaFormatIcon'

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
                    src={fromOfflineDb ?
                        (data as MediaDbOffline).picture
                        :
                        (data as ApiDefaultResult).coverImage && (data as ApiDefaultResult).coverImage.large
                    }
                    placeholder='blur'
                    blurDataURL="https://upload.wikimedia.org/wikipedia/commons/8/8d/ERR0R_NO_IMAGE_FOUND.jpg"
                    alt={`Cover Art for ${fromOfflineDb ? (data as MediaDbOffline).title : (data as ApiDefaultResult).title && (data as ApiDefaultResult).title.romaji || "Not Available"}`}
                    fill
                    sizes='100%'
                    title={fromOfflineDb ? (data as MediaDbOffline).title : (data as ApiDefaultResult).title.romaji || (data as ApiDefaultResult).title.native}
                ></Image>

                <span className={styles.media_type_icon}>

                    <MediaFormatIcon
                        format={fromOfflineDb ?
                            (data as MediaDbOffline).type == "TV" ? "ANIME" : (data as MediaDbOffline).type
                            :
                            (data as ApiDefaultResult).format == "TV" ? "ANIME" : (data as ApiDefaultResult).format
                        }
                    />

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