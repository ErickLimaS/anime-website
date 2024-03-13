"use client"
import React, { useEffect, useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import { ApiAiringMidiaResults, ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import API from '@/api/anilist'
import ChevronLeftIcon from '@/public/assets/chevron-left.svg'
import ChevronRightIcon from '@/public/assets/chevron-right.svg'
import CloseSvg from '@/public/assets/x.svg'
import { Url } from 'next/dist/shared/lib/router/router'
import MediaItemCoverInfo3 from '../../MediaItemCoverInfo3'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import AddToPlaylistButton from '../../AddToPlaylistButton'
import parse from "html-react-parser"

type Component = {

    title: string,
    route: Url,
    sort: string,
    dateOptions?: boolean,
    darkBackground?: boolean,
    layoutInverted?: boolean,

}

export const revalidate = 1800 // revalidate the data every 30 min

function NavThoughMedias({ title, route, dateOptions, sort, darkBackground, layoutInverted }: Component) {

    // IF SORT = RELEASE --> 1: 1 day (today), 7: 7 days (week), 30: 30 days (month)
    const [daysRange, setDaysRange] = useState<number>(1)

    const [data, setData] = useState<ApiDefaultResult[]>([])

    const [pageIndex, setPageIndex] = useState<number>(1)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [selectedId, setSelectedId] = useState<number | null>(null)

    async function getMedias(newPageResults?: boolean, days?: number, previous?: boolean) {

        setIsLoading(true)

        if (newPageResults == false) setPageIndex(1)

        let response

        if (sort == "RELEASE") {

            // gets the range of days than parse it to unix and get any media releasing in the selected range
            response = await API.getReleasingByDaysRange(
                "ANIME",
                days!,
                newPageResults ? (previous ? pageIndex - 1 : pageIndex + 1) : undefined
            ).then(
                res => (res as ApiAiringMidiaResults[]).filter((item) => item.media.isAdult == false)
            )

            const responseMap = response.map(item => item.media)
            response = responseMap

            setDaysRange(days!)

        }
        else {

            response = await API.getMediaForThisFormat(
                "ANIME",
                sort,
                newPageResults ? (previous ? pageIndex - 1 : pageIndex + 1) : undefined,
                5
            ).then(
                res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
            )

        }

        // handles the pagination
        if (newPageResults) setPageIndex(previous ? pageIndex - 1 : pageIndex + 1)

        setData(response)

        setIsLoading(false)
    }

    useEffect(() => {

        if (sort == "RELEASE") {

            getMedias(undefined, 1)

        }
        else {
            getMedias()
        }

    }, [])

    return (
        <>

            {dateOptions && (
                <nav id={styles.nav_tabs_container} aria-label='Media By Range of Days Menu '>

                    <ul className='display_flex_row'>
                        <li>
                            <button disabled={daysRange === 1} data-active={daysRange == 1} onClick={() => getMedias(undefined, 1, false)}>Today</button>
                        </li>
                        <span>/</span>
                        <li>
                            <button disabled={daysRange === 7} data-active={daysRange == 7} onClick={() => getMedias(undefined, 7, false)}>This week</button>
                        </li>
                        <span>/</span>
                        <li>
                            <button disabled={daysRange === 30} data-active={daysRange == 30} onClick={() => getMedias(undefined, 30, false)}>Last 30 days</button>
                        </li>
                    </ul>

                </nav>
            )}

            <div
                id={styles.itens_container}
                data-darkBackground={darkBackground && darkBackground}
                data-layoutInverted={layoutInverted && layoutInverted}
            >

                {data.length > 0 ? (
                    data.slice(0, 8).map((item, key: number) => (
                        <MediaItemCoverInfo3
                            layoutId={String(item.id)}
                            key={item.id}
                            onClick={() => setSelectedId(item.id)}
                            data={item as ApiDefaultResult}
                            positionIndex={key + 1}
                            loading={isLoading}
                            darkMode={darkBackground}
                        />
                    ))
                ) : (
                    <p className='display_align_justify_center'>
                        {!dateOptions && "No results"}
                        {(dateOptions && daysRange == 1) && "Nothing Releasing Today"}
                        {(dateOptions && daysRange == 7) && "Nothing Released in 7 Days"}
                        {(dateOptions && daysRange == 30) && "Nothing Released in 30 Days"}
                    </p>
                )}

                <AnimatePresence>
                    {selectedId && (
                        <motion.div id={styles.overlay} onClick={() => setSelectedId(null)}>
                            <motion.div
                                layoutId={String(selectedId)}
                                id={styles.expand_container}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: data.find((item) => item.id == selectedId)?.bannerImage ?
                                        `linear-gradient(rgba(0, 0, 0, 0.60) , rgba(0, 0, 0, 0.60) 50%), url(${data.find((item) => item.id == selectedId)?.bannerImage})`
                                        :
                                        `var(--black-100)`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat"
                                }}
                            >

                                <motion.button onClick={() => setSelectedId(null)} title="Close">
                                    <CloseSvg width={16} height={16} />
                                </motion.button>

                                <motion.div className={styles.media_container}>

                                    <motion.div className={styles.img_container}>

                                        <Image
                                            src={data.find((item) => item.id == selectedId)!.coverImage.extraLarge}
                                            alt={data.find((item) => item.id == selectedId)!.title.romaji}
                                            fill
                                        />

                                    </motion.div>

                                    <motion.div className={styles.info_container}>

                                        <motion.h5>{data.find((item) => item.id == selectedId)!.title.romaji}</motion.h5>

                                        <motion.p style={{ color: data.find((item) => item.id == selectedId)!.coverImage.color || "var(--white-100)" }}>
                                            {data.find((item) => item.id == selectedId)!.type}
                                        </motion.p>

                                        {data.find((item) => item.id == selectedId)!.episodes && (
                                            <motion.p>{data.find((item) => item.id == selectedId)!.episodes} Episodes</motion.p>
                                        )}

                                        <motion.p>{(data.find((item) => item.id == selectedId)!.seasonYear && (`${data.find((item) => item.id == selectedId)!.seasonYear} `))}</motion.p>

                                        {data.find((item) => item.id == selectedId)!.genres && (
                                            <motion.p>
                                                {data.find((item) => item.id == selectedId)!.genres.map((item, key) => (`${item}${key + 1 == data.find((item) => item.id == selectedId)!.genres.length ? "" : ", "}`))}
                                            </motion.p>
                                        )}

                                    </motion.div>

                                </motion.div>

                                <motion.div className={styles.description_container}>
                                    <motion.p>{parse(data.find((item) => item.id == selectedId)!.description)}</motion.p>
                                </motion.div>

                                <motion.div className={styles.btn_container}>

                                    <Link href={`/media/${data.find((item) => item.id == selectedId)!.id}`}>See More</Link>

                                    <AddToPlaylistButton data={data.find((item) => item.id == selectedId)!} />

                                </motion.div>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div id={styles.nav_title_buttons_container}>

                    <h3>{title}</h3>

                    <div id={styles.buttons_container} className='display_flex_row display_align_justify_center'>

                        <button
                            onClick={() => sort == "RELEASE" ? getMedias(true, (daysRange as number), true) : getMedias(true, undefined, true)}
                            disabled={pageIndex == 1}
                            aria-label="Previous Page Results"
                        >
                            <ChevronLeftIcon alt="Icon Facing Left" />
                        </button>

                        <button
                            onClick={() => sort == "RELEASE" ? getMedias(true, (daysRange as number), false) : getMedias(true, undefined, false)}
                            disabled={data?.length <= 3}
                            aria-label="Next Page Results"
                        >
                            <ChevronRightIcon alt="Icon Facing Right" />
                        </button>

                    </div>

                    <span id={styles.line}></span>

                    <Link href={route} className='display_align_justify_center'>VIEW ALL <ChevronRightIcon alt="Icon Facing Right" /></Link>
                </div>

            </div >

        </>
    )

}

export default NavThoughMedias