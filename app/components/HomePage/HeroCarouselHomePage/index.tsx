'use client'
import React, { useEffect, useState } from 'react'
import styles from "./carouselComponent.module.css"
import Link from 'next/link'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { wrap } from 'popmotion'
import { AnimatePresence, motion } from 'framer-motion'
import AddToPlaylistButton from '../../AddToPlaylistButton'
import SwiperListContainer from '../../SwiperListContainer'
import ListCarousel from '../HeroListCarousel'
import EyeSvg from "@/public/assets/eye-fill.svg"
import EyeSlashSvg from "@/public/assets/eye-slash-fill.svg"

function HeroCarousel({ data, isMobile }: { data: ApiDefaultResult[], isMobile: boolean }) {

    const [[page, direction], setPage] = useState([0, 0])

    const [autoPlayTrailer, setAutoPlayTrailer] = useState<boolean>(true)

    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
            };
        }
    }

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    }

    const imageIndex = wrap(0, data.length, page);

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    let styledList = {
        background: isMobile ?
            `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${data[imageIndex]?.coverImage.extraLarge})`
            :
            `linear-gradient(rgba(0, 0, 0, 0.00), var(--background) 100%), url(${data[imageIndex]?.bannerImage})`
        ,
        backgroundPosition: isMobile ?
            "top"
            :
            "center"
        ,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
    }

    // change auto play trailer state 
    function changeTrailerState() {

        localStorage.setItem("autoPlayTrailer", `${!autoPlayTrailer}`)
        setAutoPlayTrailer(!autoPlayTrailer)

    }

    useEffect(() => {

        if (localStorage.getItem("autoPlayTrailer") == undefined) {

            setAutoPlayTrailer(true)
            localStorage.setItem("autoPlayTrailer", "true")

            return
        }

        setAutoPlayTrailer(localStorage.getItem("autoPlayTrailer") == "true" ? true : false)

    }, [])

    return (
        <section id={styles.hero_section_container}>

            {/* CAROUSEL OF BCG IMG AND MEDIA TITLE*/}
            {data != undefined && (

                <AnimatePresence initial={true} custom={direction} mode='sync'>

                    <ul id="carousel" className={`${styles.carousel_container} display_flex_row`}>

                        <motion.li
                            key={page}
                            className={styles.carousel_item}
                            style={styledList}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                        >

                            {autoPlayTrailer && data[imageIndex]?.trailer && (
                                <AnimatePresence>
                                    <motion.div className={styles.video_container}>
                                        <motion.iframe
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 3 }}
                                            src={`https://www.youtube.com/embed/${data[imageIndex].trailer.id}?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&showinfo=0&playlist=${data[imageIndex].trailer.id}`}
                                            frameBorder={0}
                                            title={data[imageIndex].title.romaji + " Trailer"}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            )}


                            <div className={styles.carousel_position_wrapper}>
                                <div className={styles.item_info}>

                                    <h2><Link href={`/media/${data[imageIndex]?.id}`}>{data[imageIndex]?.title.romaji}</Link></h2>

                                    <div className={`${styles.item_info_inside} display_flex_row`}>

                                        {data[imageIndex]?.seasonYear != undefined && (
                                            <p>{data[imageIndex].seasonYear.toString()}</p>
                                        )}
                                        {((data[imageIndex]?.genres != undefined) && (data[imageIndex]?.seasonYear != undefined)) && (
                                            <span>|</span>
                                        )}
                                        {data[imageIndex]?.genres != undefined && (
                                            <p><Link href={`/search?genre=[${data[imageIndex]?.genres[0].toLowerCase()}]`}>{data[imageIndex]?.genres[0]}</Link></p>
                                        )}
                                        {((data[imageIndex]?.seasonYear != undefined) && (data[imageIndex]?.episodes != undefined)) && (
                                            <span>|</span>
                                        )}

                                        {data[imageIndex]?.episodes != undefined && data[imageIndex].format != "MOVIE" && (
                                            <p>{data[imageIndex].episodes.toString()} {data[imageIndex].episodes > 1 ? "Episodes" : "Episode"}</p>
                                        )}

                                        {data[imageIndex]?.duration && data[imageIndex].format == "MOVIE" && (
                                            <p>{data[imageIndex].duration} Minutes</p>
                                        )}

                                    </div>

                                    <div className={styles.item_buttons}>

                                        <Link href={`/media/${data[imageIndex]?.id}`}>{data[imageIndex].format == "MANGA" ? "READ" : "WATCH"} NOW</Link>

                                        <AddToPlaylistButton data={data[imageIndex]} />

                                    </div>

                                </div>
                            </div>

                        </motion.li>

                    </ul >

                </AnimatePresence>

            )}

            {/* RECOMENDATIONS GRID */}
            <div id={styles.recomendations_position_wrapper}>
                <div id={styles.recomendations_container}>

                    <h3>Todays Recomendation</h3>

                    {/* SHOWS ONLY ON MOBILE */}

                    <div id={styles.swiper_list_container}>
                        {data != undefined && (
                            <SwiperListContainer
                                onClick={(e: { target: { outerText: string } }) => setPage(
                                    [
                                        data.findIndex((item) => item.title.romaji == e.target.outerText),
                                        data.findIndex((item) => item.title.romaji == e.target.outerText)
                                    ]
                                )}
                                data={data.slice(0, 9)}
                                options={{
                                    slidesPerView: 2,
                                    bp480: 2,
                                    bp740: 3,
                                    bp1275: 3
                                }}
                                customHeroSection
                            />
                        )}
                    </div>

                    {/* SHOWS ONLY ON DESKTOP */}
                    <ul>
                        {data != undefined && (
                            data.slice(0, 9).map((item, key: number) => (
                                item.bannerImage && (
                                    <ListCarousel
                                        onClick={() => setPage([key, key])}
                                        key={key}
                                        data={item}
                                    />
                                ))
                            )
                        )}
                    </ul>

                </div>
            </div>

            {/* STOP/PLAY TRAILER BUTTON */}
            <div id={styles.stop_trailer_btn_container}>
                <motion.button
                    onClick={() => changeTrailerState()}
                    whileTap={{ scale: 0.9 }}
                >
                    {autoPlayTrailer ? (
                        <><EyeSlashSvg width={16} height={16} /> Stop Auto Play Trailer</>
                    ) : (
                        <><EyeSvg width={16} height={16} /> Auto Play Trailer</>
                    )}
                </motion.button>
            </div>

        </section>
    )
}

export default HeroCarousel