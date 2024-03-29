"use client"
import React, { useState } from 'react'
import MediaItemCoverInfo from '../../MediaItemCoverInfo'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Link from 'next/link'
import styles from "./component.module.css"
import ChevronRightIcon from '@/public/assets/chevron-right.svg';
import LoadingSvg from '@/public/assets/Eclipse-1s-200px.svg';
import SwiperListContainer from '../../SwiperListContainer'
import { AnimatePresence, motion } from 'framer-motion'
import anilist from '@/api/anilist'

function PopularMediaSection({ initialData }: { initialData: ApiDefaultResult[] }) {

    const [loading, setLoading] = useState<boolean>(false)
    const [disableBtn, setDisableBtn] = useState<boolean>(false)

    const [fetchedData, setFetchedData] = useState<ApiDefaultResult[]>([])
    const [currPage, setCurrPage] = useState(2) // starts on page 2, because it will be used after the home page fetch 

    async function loadMoreData() {

        setLoading(true)

        const trendingData = await anilist.getNewReleases("ANIME", undefined, undefined, false, "RELEASING", currPage, 14).then(
            res => (res as ApiDefaultResult[])
        )

        if (!trendingData || trendingData.length == 0) {

            setDisableBtn(true)
            setLoading(false)

            return

        }

        if (trendingData.length <= 13) setDisableBtn(true)

        const pushToOlderResults = [...fetchedData, ...trendingData]

        setFetchedData(pushToOlderResults)
        setCurrPage(currPage + 1)

        setLoading(false)

    }

    const motionVariants = {
        initial: {
            scale: 0,
        },
        animate: {
            scale: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    return (
        <React.Fragment>
            <section id={styles.popular_container} >
                <React.Fragment>

                    <div id={styles.title_container}>

                        <h2>Popular Animes to Watch Now</h2>

                        <p>Most watched animes by days</p>

                        <span></span>

                        <Link href={'#'}>VIEW ALL <ChevronRightIcon width={16} height={16} /></Link>

                    </div>

                    {/* SHOWS ONLY ON MOBILE */}
                    <div id={styles.popular_list_container}>
                        <SwiperListContainer data={fetchedData?.length > 0 ? fetchedData : initialData} />
                    </div>

                    {initialData.map((item, key: number) => (
                        <MediaItemCoverInfo data={item} key={key} positionIndex={key + 1} darkMode={true} hiddenOnDesktop />
                    ))}


                </React.Fragment>

            </section>

            <AnimatePresence>
                {fetchedData?.length > 0 && (
                    <motion.div
                        id={styles.new_fetched_data_container}
                        variants={motionVariants}
                        initial={"initial"}
                        animate={"animate"}
                    >
                        {fetchedData?.map((item, key: number) => (
                            <MediaItemCoverInfo data={item} key={key} darkMode={true} hiddenOnDesktop />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SHOWS ONLY ON DESKTOP */}
            <div id={styles.navigation_link_container}>

                <span id={styles.line}></span>

                <motion.button onClick={() => loadMoreData()} data-loading={loading} disabled={disableBtn}>
                    {loading ? <LoadingSvg width={16} height={16} /> : "+ View more"}
                </motion.button >

            </div>
        </React.Fragment>
    )
}

export default PopularMediaSection