"use client"
import React from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import MovieSvg from "@/public/assets/film.svg"
import AnimeSvg from "@/public/assets/play-circle.svg"
import MangaSvg from "@/public/assets/book.svg"
import MusicSvg from "@/public/assets/music-note-beamed.svg"
import { motion } from 'framer-motion'

type ComponentTypes = {
    data: ApiDefaultResult,
    onClick: (parameter: string) => void,
    positionIndex?: number,
    darkMode?: boolean,
    loading?: boolean,
    hiddenOnDesktop?: boolean,
    layoutId?: string,
    key?: any
}

function MediaItemCoverInfo3({ positionIndex, data, darkMode, loading, hiddenOnDesktop, layoutId, onClick }: ComponentTypes) {

    const customStyle = positionIndex && { gridArea: `item${positionIndex}` }

    return (
        <motion.div
            layoutId={layoutId}
            onClick={() => onClick(String((data as ApiDefaultResult).id))}
            className={`${styles.media_item_container} ${darkMode ? styles.darkMode : ''} ${hiddenOnDesktop ? styles.midia_item_container_hidden : ""}`}
            style={customStyle || undefined}
            data-loading={loading || false}
        >
            <div id={styles.img_container}>

                <Image
                    src={(data as ApiDefaultResult).coverImage && (data as ApiDefaultResult).coverImage.large}
                    placeholder='blur'
                    blurDataURL="https://upload.wikimedia.org/wikipedia/commons/8/8d/ERR0R_NO_IMAGE_FOUND.jpg"
                    alt={`Cover Art for ${(data as ApiDefaultResult).title && (data as ApiDefaultResult).title.romaji || "Not Available"}`}
                    fill
                    sizes='100%'
                    title={(data as ApiDefaultResult).title.romaji || (data as ApiDefaultResult).title.native}
                ></Image>

                <motion.span className={styles.media_type_icon}>

                    {

                        ((data as ApiDefaultResult).format == "OVA" ||
                            (data as ApiDefaultResult).format == "TV" ||
                            (data as ApiDefaultResult).format == "ONA" ||
                            (data as ApiDefaultResult).format == "SPECIAL"
                        )
                        && <AnimeSvg width={16} height={16} alt="Tv Icon" />
                    }
                    {((data as ApiDefaultResult).format == "MOVIE") && <MovieSvg width={16} height={16} alt="Movie Icon" />}
                    {((data as ApiDefaultResult).format == "MANGA") && <MangaSvg width={16} height={16} alt="Manga Icon" />}
                    {((data as ApiDefaultResult).format == "MUSIC") && <MusicSvg width={16} height={16} alt="Music Icon" />}

                    <motion.span className={styles.media_format_title}>
                        {(data as ApiDefaultResult).format == "TV" ? "ANIME" : (data as ApiDefaultResult).format}
                    </motion.span>

                </motion.span>

            </div>

            {(data as ApiDefaultResult).seasonYear != undefined && (data as ApiDefaultResult).genres != undefined
                &&
                <motion.small>
                    {((data as ApiDefaultResult).seasonYear &&
                        (`${(data as ApiDefaultResult).seasonYear}, `))}
                    {(data as ApiDefaultResult).genres && (data as ApiDefaultResult).genres[0]
                    }
                </motion.small>
            }

            <p>{data.title && (data as ApiDefaultResult).title.romaji}</p>
        </motion.div>
    )

}

export default MediaItemCoverInfo3