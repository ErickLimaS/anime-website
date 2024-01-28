'use client'
import React, { useEffect } from 'react'
import styles from "./carouselComponent.module.css"
import Link from 'next/link'
import Image from 'next/image'
import { ApiTrendingMidiaResults } from '@/app/ts/interfaces/apiDataInterface'

function HeroCarousel({ data }: { data: ApiTrendingMidiaResults[] }) {

    useEffect(() => {

        scrollHeroSection()

    }, [])

    function scrollHeroSection() {

        if (typeof window !== "undefined") {
            let isDragging = false;

            let startPosition = 0;
            let currentTranslate = 0;

            let currentListIndex = 1

            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            let wasDraggedMoreThanOneThirdScreen = false

            const carousel = document.getElementById(`carousel`) as HTMLElement;

            if (carousel) {

                carousel.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    startPosition = e.clientX - currentTranslate;
                });

                carousel.addEventListener('mouseup', (e) => {
                    isDragging = false;
                    currentTranslate = vw - (vw * (currentListIndex + 1))
                    const newPosition = e.clientX - (startPosition - currentTranslate)

                    currentTranslate = newPosition - vw;

                    if (wasDraggedMoreThanOneThirdScreen) {
                        transitionBeetweenItens()
                    }

                });

                carousel.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;

                    const newPosition = currentListIndex > 1 ? (e.clientX - (vw * currentListIndex)) : (e.clientX - startPosition)

                    currentTranslate = newPosition;

                    if ((currentListIndex + 1) == data.length) return

                    updateCarousel();

                    if (currentTranslate + (vw * 1.25)) {
                        wasDraggedMoreThanOneThirdScreen = true
                    }

                });
            }

            const updateCarousel = () => {
                carousel.style.transform = `translateX(${currentTranslate}px)`;
            }

            const transitionBeetweenItens = () => {

                carousel.style.transform = `translateX(${(vw - (vw * (currentListIndex + 1)))}px)`;
                currentListIndex++
                currentTranslate = 0
                wasDraggedMoreThanOneThirdScreen = false

            }

        }
    }

    return (
        <>
            <ul id="carousel" className={`${styles.carousel_container} display_flex_row`}>

                {data != undefined && (
                    data.map((item: ApiTrendingMidiaResults, key: number) => (
                        <li
                            key={key}
                            className={styles.carousel_item}
                            style={{
                                background: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.10)), url(${item.media.bannerImage})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat"
                            }}>
                            <div className={styles.item_info}>

                                <h2><Link href={`/media/${item.media.id}`}>{item.media.title.romaji}</Link></h2>

                                <div className={`${styles.item_info_inside} display_flex_row`}>

                                    {item.media.seasonYear != undefined && (
                                        <p>{item.media.seasonYear.toString()}</p>
                                    )}
                                    {((item.media.genres != undefined) && (item.media.seasonYear != undefined)) && (
                                        <span>|</span>
                                    )}
                                    {item.media.genres != undefined && (
                                        <p><Link href={`/genre/${item.media.genres[0].toLowerCase()}`}>{item.media.genres[0]}</Link></p>
                                    )}
                                    {((item.media.seasonYear != undefined) && (item.media.episodes != undefined)) && (
                                        <span>|</span>
                                    )}
                                    {item.media.episodes != undefined && (
                                        <p>{item.media.episodes.toString()} Episodes</p>
                                    )}

                                </div>

                                <div className={styles.item_buttons}>

                                    <Link href={`/media/${item.media.id}`}>WATCH NOW</Link>

                                    <button>+ PLAYLIST</button>

                                </div>

                            </div>

                        </li>
                    ))
                )}

            </ul>

            <div id={styles.recomendations_container}>

                <h3>Recomendations</h3>

                <ul className="display_grid">
                    {data != undefined && (
                        data.slice(0, 6).map((item: ApiTrendingMidiaResults, key: number) => (
                            item.media.bannerImage && (
                                <li key={key}>
                                    <Image src={item.media.bannerImage} alt={`Cover for ${item.media.title.romaji}`} fill />
                                </li>
                            ))
                        )
                    )}
                </ul>

            </div>

        </>
    )
}

export default HeroCarousel