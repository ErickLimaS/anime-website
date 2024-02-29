'use client'
import React, { useState } from 'react'
import styles from "./carouselComponent.module.css"
import Link from 'next/link'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { wrap } from 'popmotion'
import { AnimatePresence, motion } from 'framer-motion'
import AddToPlaylistButton from '../../AddToPlaylistButton'
import SwiperListContainer from '../../SwiperListContainer'
import ListCarousel from '../HeroListCarousel'

function HeroCarousel({ data, isMobile }: { data: ApiDefaultResult[], isMobile: boolean }) {

    const [[page, direction], setPage] = useState([0, 0]);

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
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

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

    return (
        <>
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

                        </motion.li>

                    </ul >

                </AnimatePresence>
            )}

            <div id={styles.recomendations_container}>

                <h3>Todays Recomendation</h3>

                {/* SHOWS ONLY ON MOBILE */}
                <div id={styles.swiper_list_container}>
                    {data != undefined && (
                        <SwiperListContainer
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
                                <ListCarousel key={key} data={item} className={styles.desktop_list_item} />
                            ))
                        )
                    )}
                </ul>

            </div>

        </>
    )
}

export default HeroCarousel