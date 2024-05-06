"use client"
import React from 'react'
import styles from './component.module.css'
import Image from 'next/image'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { motion } from 'framer-motion'
import MediaFormatIcon from '../../DynamicAssets/MediaFormatIcon'

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

const popUpMediaMotion = {
    initial: {
        scale: 0,
    },
    animate: {
        scale: 1,
    }
}

function MediaCover3({ positionIndex, data, darkMode, loading, hiddenOnDesktop, layoutId, onClick }: ComponentTypes) {

    const customStyle = positionIndex && { gridArea: `item${positionIndex}` }

    return (
        <motion.div
            variants={popUpMediaMotion}
            layoutId={layoutId}
            onClick={() => onClick(String(data.id))}
            className={`${styles.media_item_container} ${darkMode ? styles.darkMode : ''} ${hiddenOnDesktop ? styles.midia_item_container_hidden : ""}`}
            style={customStyle || undefined}
            data-loading={loading || false}
        >
            <div id={styles.img_container}>

                <Image
                    title={data.title.romaji || data.title.native}
                    src={data.coverImage && data.coverImage.large}
                    alt={`Cover Art for ${data.title && data.title.romaji || "Not Available"}`}
                    placeholder='blur'
                    blurDataURL="https://upload.wikimedia.org/wikipedia/commons/8/8d/ERR0R_NO_IMAGE_FOUND.jpg"
                    fill
                    sizes='(max-width: 400px) 40vw, 140px'
                ></Image>

                <motion.span className={styles.media_type_icon}>

                    <MediaFormatIcon format={data.format} />

                    <motion.span className={styles.media_format_title}>
                        {data.format == "TV" ? "ANIME" : data.format}
                    </motion.span>

                </motion.span>

            </div>

            {data.seasonYear != undefined && data.genres != undefined
                &&
                <motion.small>
                    {(data.seasonYear &&
                        (`${data.seasonYear}, `))}
                    {data.genres && data.genres[0]
                    }
                </motion.small>
            }

            <p>{data.title && data.title.romaji}</p>
        </motion.div>
    )

}

export default MediaCover3