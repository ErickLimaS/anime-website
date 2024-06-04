import React from 'react'
import Image from 'next/image'
import styles from "./component.module.css"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { AnimatePresence, motion } from 'framer-motion'

function ListItemHeroCarousel({ animeInfo, handleFunction }: { animeInfo: ApiDefaultResult, handleFunction?: any }) {
    return (
        <li className={styles.container}>
            <div title={`Watch ${animeInfo.title.userPreferred}`} onClick={handleFunction}>
                <Image
                    src={animeInfo.bannerImage}
                    alt={`Cover for ${animeInfo.title.userPreferred}`}
                    fill
                    sizes='(max-width: 1199px) 75vw, 25vw'
                />
                <AnimatePresence>
                    <motion.span initial={{ height: 0 }} animate={{ height: "100%", transition: { duration: 0.6 } }} exit={{ height: 0 }}>
                        <span className={styles.title}>
                            {animeInfo.title.userPreferred || "Not Available"}
                        </span>
                    </motion.span>
                </AnimatePresence>
            </div>
        </li>
    )
}

export default ListItemHeroCarousel