"use client"
import React, { useState } from 'react'
import styles from "./component.module.css"
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import { MediaDbOffline } from '@/app/ts/interfaces/dbOffilineInterface'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SelectSort from '@/app/components/SelectSortInputs'
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"

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

function ResultsContainer({ data, totalLength, lastUpdate }: { data: MediaDbOffline[], totalLength: number, lastUpdate: string }) {

    const [newRange, setNewRange] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)

    const itemsPerClick = 12

    const router = useRouter()
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function fetchData() {

        setLoading(true)

        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.set("page", `${newRange + 1}`)
        setNewRange(newRange + 1)

        const query = current ? `?${current}` : ""

        router.push(`${pathname}${decodeURI(query)}`, { scroll: false })

        setLoading(false)

    }

    return (
        <div id={styles.content_container}>

            <div id={styles.heading_container}>
                <h1>Results</h1>

                <SelectSort />
            </div>

            {data.length == 0 && (
                <div id={styles.error_text}>
                    <h2>No Results Found</h2>
                </div>
            )}

            {data.length > 0 && (
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
            )}

            {((itemsPerClick * newRange) < totalLength) && (
                <button onClick={() => fetchData()} aria-label={loading ? "Loading" : "View More Results"}>
                    {loading ? <LoadingSvg width={16} height={16} /> : " + View more"}
                </button>
            )}

            {data.length > 0 && (
                <span>
                    Showing {(itemsPerClick * newRange >= totalLength) ?
                        "all " : `${itemsPerClick * newRange} out of `}
                    <span>{totalLength.toLocaleString("en-US")}</span> results
                </span>
            )}

            <span style={{ display: "block", fontSize: "var(--font-size--small-2" }}>
                Last Update: {new Date(lastUpdate).toLocaleDateString("en-us", { day: "numeric", month: "long", year: "numeric" }) || "undefined"}
            </span>
        </div >
    )
}

export default ResultsContainer