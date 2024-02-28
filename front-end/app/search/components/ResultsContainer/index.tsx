"use client"
import React, { useState } from 'react'
import styles from "./component.module.css"
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'
import { AnimatePresence, motion } from 'framer-motion'

function ResultsContainer({ data }: { data: MediaDbOffline[] }) {

    const [newRange, setNewRange] = useState<number>(1)

    const itemsPerClick = 12

    const showUpMotion = {

        hidden: {
            opacity: 0,
            scale: 1.08
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1
            }
        }

    }

    return (
        <div id={styles.content_container}>

            <h1>Results</h1>

            <div id={styles.results_container}>
                <AnimatePresence
                    initial={true}
                    mode='wait'
                >
                    {data.slice(0, (itemsPerClick * newRange)).map((item, key: number) => (
                        <motion.div key={key}
                            variants={showUpMotion}
                            initial="hidden"
                            animate="visible"
                        >
                            <MediaItemCoverInfo darkMode data={item} fromOfflineDb />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {(itemsPerClick * newRange < data.length) && (
                <button onClick={() => setNewRange(newRange + 1)}>+ View more</button>
            )}

            <span>Showing {(itemsPerClick * newRange >= data.length) ?
                "all " : `${itemsPerClick * newRange} out of `}
                <span>{data.length}</span> results
            </span>

        </div>
    )
}

export default ResultsContainer