"use client"
import React, { useState } from 'react'
import styles from "./component.module.css"
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SelectSort from '@/app/components/SelectSortInputs'

function ResultsContainer({ data, totalLength, lastUpdate }: { data: MediaDbOffline[], totalLength: number, lastUpdate: string }) {

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

    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function fetchData() {

        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.set("page", `${newRange + 1}`)
        setNewRange(newRange + 1)

        const query = current ? `?${current}` : ""

        router.push(`${pathname}${decodeURI(query)}`, { scroll: false })

    }

    return (
        <div id={styles.content_container}>

            <div id={styles.heading_container}>
                <h1>Results</h1>

                <SelectSort />
            </div>

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

            {((itemsPerClick * newRange) < totalLength) && (
                <button onClick={() => fetchData()}> + View more</button>
            )}

            <span>Showing {(itemsPerClick * newRange >= totalLength) ?
                "all " : `${itemsPerClick * newRange} out of `}
                <span>{totalLength.toLocaleString("en-US")}</span> results
            </span>

            <span style={{ display: "block", fontSize: "var(--font-size--small-2" }}>Last Update: {lastUpdate.replace(/\-/g, "/") || "undefined"}</span>
        </div >
    )
}

export default ResultsContainer