"use client"
import React, { SetStateAction, useEffect, useState } from 'react'
import styles from './component.module.css'
import Link from 'next/link'
import { ApiAiringMidiaResults, ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from '@/app/api/anilist'
import CloseSvg from '@/public/assets/x.svg'
import PlaySvg from '@/public/assets/play.svg'
import { Url } from 'next/dist/shared/lib/router/router'
import MediaCover3 from '../../MediaCards/MediaCover3'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import AddToPlaylistButton from '../../Buttons/AddToPlaylist'
import parse from "html-react-parser"
import ScoreRating from '../../DynamicAssets/ScoreRating'
import MediaFormatIcon from '../../DynamicAssets/MediaFormatIcon'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/app/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import SwiperCarousel from './swiperCarousel'
import { SwiperSlide } from 'swiper/react'
import { convertToUnix } from '@/app/lib/formatDateUnix'

type ComponentType = {

    title: string,
    route: Url,
    sort: string,
    mediaFormat?: "ANIME" | "MANGA",
    dateOptions?: boolean,
    darkBackground?: boolean,
    layoutInverted?: boolean,
    sortResultsByTrendingLevel?: boolean

}

export const revalidate = 1800 // revalidate cached data every 30 min

const popUpMediaMotion = {
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

function NavThoughMedias({ title, route, mediaFormat, dateOptions, sort, darkBackground, layoutInverted, sortResultsByTrendingLevel }: ComponentType) {

    // IF SORT = RELEASE --> 1: 1 day (today), 7: 7 days (week), 30: 30 days (month)
    const [daysRange, setDaysRange] = useState<1 | 7 | 30>(1)

    const [data, setData] = useState<ApiDefaultResult[]>([])

    const [trailerActive, setTrailerActive] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [showAdultContent, setShowAdultContent] = useState<boolean | null>(null)

    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [mediaSelect, setMediaSelected] = useState<ApiDefaultResult | null>(null)

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    async function getMedias(days?: 1 | 7 | 30) {

        setIsLoading(true)

        let response: ApiAiringMidiaResults[] | ApiDefaultResult[] | void

        let docUserShowAdultContent = showAdultContent || false

        if (user && showAdultContent == null) {

            docUserShowAdultContent = await getDoc(doc(db, 'users', user!.uid)).then(doc => doc.get("showAdultContent"))

            setShowAdultContent(docUserShowAdultContent)

        }

        if (sort == "RELEASE") {

            // gets the range of days than parse it to unix and get any media releasing in the selected range
            response = await anilist.getReleasingByDaysRange(
                mediaFormat || "ANIME",
                days!,
                undefined,
                40,
                docUserShowAdultContent
            ) as ApiAiringMidiaResults[]

            // Remove releases from "today" to show on other options
            if (days != 1 && days != undefined) {
                response = (response as ApiAiringMidiaResults[]).filter((item) => (
                    convertToUnix(1) > item.airingAt && item.airingAt > convertToUnix(days)) && item.media
                )
            }

            const responseMap = (response as ApiAiringMidiaResults[]).map(item => item.media)

            response = responseMap

            setDaysRange(days!)

        }
        else {

            response = await anilist.getMediaForThisFormat(
                mediaFormat || "ANIME",
                sort,
                20,
                undefined,
                docUserShowAdultContent
            ).then(
                res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
            )

        }

        if (sortResultsByTrendingLevel) {

            response = (response as ApiDefaultResult[]).sort((a, b) => a.trending - b.trending).reverse()

        }

        setData(response as ApiDefaultResult[])

        setIsLoading(false)
    }

    // handles Popin of the media selected
    function setMediaPreview(media: number | null) {

        if (media == null) {
            setSelectedId(null)
            setTrailerActive(false)
            setMediaSelected(null)
        }
        else {
            setSelectedId(media)
            setMediaSelected(data.find((item) => item.id == media) as SetStateAction<ApiDefaultResult | null>)
        }
    }

    useEffect(() => {

        if (sort == "RELEASE") {

            getMedias(1)

        }
        else {
            getMedias()
        }

    }, [])

    return (
        <React.Fragment>

            {dateOptions && (
                <nav id={styles.nav_tabs_container} aria-label='Media By Range of Days Menu '>

                    <ul className='display_flex_row'>
                        <li>
                            <button disabled={daysRange === 1} data-active={daysRange == 1} onClick={() => getMedias(1)}>
                                Today
                            </button>
                        </li>
                        <span>/</span>
                        <li>
                            <button disabled={daysRange === 7} data-active={daysRange == 7} onClick={() => getMedias(7)}>
                                This week
                            </button>
                        </li>
                        <span>/</span>
                        <li>
                            <button disabled={daysRange === 30} data-active={daysRange == 30} onClick={() => getMedias(30)}>
                                Last 30 days
                            </button>
                        </li>
                    </ul>

                </nav>
            )}

            <motion.div
                id={styles.itens_container}
                data-darkBackground={darkBackground && darkBackground}
                data-layoutInverted={layoutInverted && layoutInverted}
                variants={popUpMediaMotion}
                initial="initial"
                animate="animate"
            >

                <SwiperCarousel
                    title={title}
                    daysSelected={daysRange}
                >

                    {data.length > 0 ? (

                        data.map((item, key) => (
                            <SwiperSlide key={item.id}>
                                <MediaCover3
                                    layoutId={String(item.id)}
                                    onClick={() => setMediaPreview(item.id)}
                                    data={item as ApiDefaultResult}
                                    positionIndex={key + 1}
                                    loading={isLoading}
                                    darkMode={darkBackground}
                                />
                            </SwiperSlide>
                        ))

                    ) : (

                        <p className='display_align_justify_center'>
                            {!dateOptions && "No results"}
                            {(dateOptions && daysRange == 1) && "Nothing Releasing Today"}
                            {(dateOptions && daysRange == 7) && "Nothing Released in 7 Days"}
                            {(dateOptions && daysRange == 30) && "Nothing Released in 30 Days"}
                        </p>

                    )}

                </SwiperCarousel>

                {/* WHEN A ID IS SELECTED, SHOWS A INFO PREVIEW OF MEDIA */}
                <AnimatePresence>
                    {(selectedId && mediaSelect) && (
                        <motion.div
                            id={styles.overlay}
                            onClick={() => setMediaPreview(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                layoutId={String(selectedId)}
                                id={styles.expand_container}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: mediaSelect.bannerImage ?
                                        `linear-gradient(to bottom right, rgba(0, 0, 0, 0.95) 25%, rgba(0, 0, 0, 0.75) ), url(${mediaSelect.bannerImage})`
                                        :
                                        `var(--black-100)`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat"
                                }}
                            >

                                <motion.button onClick={() => setMediaPreview(null)} title="Close">
                                    <CloseSvg width={16} height={16} />
                                </motion.button>

                                <motion.div className={styles.media_container}>

                                    <motion.div className={styles.img_container}>

                                        <Image
                                            src={mediaSelect.coverImage.large}
                                            alt={mediaSelect.title.romaji}
                                            fill
                                            sizes='(max-width: 430px) 45vw, (max-width: 620px) 33vw, (max-width: 876px) 15vw, 10vw'
                                        />

                                    </motion.div>

                                    <motion.div className={styles.info_container}>

                                        <motion.h5>
                                            {mediaSelect.title.romaji}
                                            {(mediaSelect.seasonYear && (<span> ({mediaSelect.seasonYear})</span>))}
                                        </motion.h5>

                                        <motion.p style={{ color: mediaSelect.coverImage.color || "var(--white-100)" }}>
                                            <MediaFormatIcon format={mediaSelect.format} /> {mediaSelect.format == "TV" ? "ANIME" : mediaSelect.format}
                                        </motion.p>

                                        {mediaSelect.averageScore && (
                                            <motion.p>
                                                <ScoreRating score={(mediaSelect.averageScore / 2) / 10} source='anilist' />
                                            </motion.p>
                                        )}

                                        {(mediaSelect.episodes && mediaSelect.format != "MOVIE" && mediaSelect.format != "MUSIC" && mediaSelect.format != "MANGA") && (
                                            <motion.p>{mediaSelect.episodes} Episodes</motion.p>
                                        )}

                                        {mediaSelect.genres && (
                                            <motion.p className={styles.smaller_fonts}>
                                                {mediaSelect.genres.map((item, key) => (`${item}${key + 1 == mediaSelect.genres.length ? "" : ", "}`))}
                                            </motion.p>
                                        )}

                                    </motion.div>

                                </motion.div>

                                {/* SHOWS TRAILER / SHOWS DESCRIPTION */}
                                {trailerActive ? (

                                    <motion.div className={styles.trailer_container}>
                                        <iframe
                                            className="yt_embed_video"
                                            src={`https://www.youtube.com/embed/${mediaSelect.trailer.id}`}
                                            frameBorder={0}
                                            title={mediaSelect.title.romaji + " Trailer"}
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                                            allowFullScreen></iframe>
                                    </motion.div>

                                ) : (
                                    mediaSelect.description && (
                                        <motion.div className={styles.description_container}>
                                            <motion.p>{parse(mediaSelect.description.replace(new RegExp(`<br[^>]*>|<\/br>`, 'gi'), " "))}</motion.p>
                                        </motion.div>
                                    )
                                )}

                                <motion.div className={styles.btns_container}>

                                    <motion.div className={`${styles.action_btns_container}`}>

                                        <Link href={`/media/${mediaSelect.id}`}>SEE MORE</Link>

                                        <AddToPlaylistButton data={mediaSelect} />

                                    </motion.div>

                                    {mediaSelect.trailer && (
                                        <motion.div className={`${styles.action_btns_container} ${styles.trailer_btn_container}`}>

                                            <motion.button
                                                className={styles.trailer_btn}
                                                onClick={() => setTrailerActive(!trailerActive)}
                                                data-active={trailerActive}
                                            >
                                                <PlaySvg alt="Play" width={16} height={16} /> TRAILER
                                            </motion.button>

                                        </motion.div>
                                    )}

                                </motion.div>

                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>

        </React.Fragment>
    )

}

export default NavThoughMedias