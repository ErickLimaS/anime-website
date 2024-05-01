"use client"
import React, { useEffect } from 'react'
import styles from "./component.module.css"
import { MangaChapters } from '@/app/ts/interfaces/apiMangadexDataInterface'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ButtonMarkChapterAsRead from '@/app/components/ButtonMarkChapterAsRead'

type ComponentTypes = {
    mediaId: number,
    currChapterId: string,
    episodesList: MangaChapters[]
}

const loadingEpisodesMotion = {
    initial: {
        scale: 0,
    },
    animate: {
        scale: 1,
        transition: {
            staggerChildren: 0.02,
        },
    },
}

function ChaptersSideListContainer({ mediaId, currChapterId, episodesList }: ComponentTypes) {

    useEffect(() => {

        // focus list item that correspond to current episode on page
        const centerActiveEpisode = () => {
            const elementActive = document.querySelector("li[data-active=true]")

            elementActive?.scrollIntoView()

            window.scrollTo({ top: 0, behavior: 'instant' })
        }

        setTimeout(centerActiveEpisode, 500)

    }, [currChapterId])

    return (
        <div id={styles.chapters_list_container}>

            <div className={styles.heading_container}>
                <h3>CHAPTERS</h3>
            </div>

            <motion.ol
                id={styles.list_container}
                variants={loadingEpisodesMotion}
                initial="initial"
                animate="animate"
            >


                {episodesList?.map((item, key: number) => (
                    <motion.li
                        title={`Chapter ${item.chapterNumber} - ${item.title}`}
                        key={key}
                        data-active={item.id == currChapterId}
                        data-disabled={item.pages == 0} // no pages for this chapter
                        variants={loadingEpisodesMotion}
                    >

                        <Link
                            href={`/read/${mediaId}?source=mangadex&chapter=${item.chapterNumber}&q=${item.id}`}
                        >

                            <div className={styles.img_container}>
                                <span>{item.chapterNumber}</span>
                            </div>

                        </Link>

                        <div className={styles.chapter_info_container}>

                            <Link
                                href={`/read/${mediaId}?source=mangadex&chapter=${item.chapterNumber}&q=${item.id}`}
                            >
                                <h4>{item.pages == 0 ? `${item.title} (Not Available)` : item.title == item.chapterNumber ? `Chapter ${item.chapterNumber}` : item.title}</h4>
                            </Link>

                            <ButtonMarkChapterAsRead
                                chapterNumber={Number(item.chapterNumber)}
                                chapterTitle={item.title}
                                mediaId={mediaId}
                                hasText={true}
                            />

                        </div>

                    </motion.li>
                ))}

            </motion.ol>

        </div >
    )
}

export default ChaptersSideListContainer