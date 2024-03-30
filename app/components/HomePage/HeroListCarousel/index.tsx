import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import styles from "./component.module.css"
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { AnimatePresence, motion } from 'framer-motion'

function ListCarousel({ data, className }: { data: ApiDefaultResult, className?: string }) {
    return (
        <li className={styles.container}>
            <Link href={`/media/${data.id}`} title={`Watch ${data.title.romaji}`}>
                <Image
                    src={data.bannerImage}
                    alt={`Cover for ${data.title.romaji}`}
                    fill
                    sizes='(max-width: 1199px) 75vw, 25vw'
                />
                <AnimatePresence>
                    <motion.span initial={{ height: 0 }} animate={{ height: "100%", transition: { duration: 0.6 } }} exit={{ height: 0 }}>
                        <span className={styles.title}>
                            {data.title.romaji || "Not Available"}
                        </span>
                    </motion.span>
                </AnimatePresence>
            </Link>
        </li>
    )
}

export default ListCarousel