"use client"
import React, { useEffect } from 'react'
import styles from "./component.module.css"
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import Link from 'next/link'
import ButtonMarkEpisodeAsWatched from '@/app/components/ButtonMarkEpisodeAsWatched'
import { EpisodeAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import { motion } from 'framer-motion'
import { ImdbEpisode } from '@/app/ts/interfaces/apiImdbInterface'

type ComponentTypes = {
    source: string,
    mediaId: number,
    vidsrcId?: number,
    activeEpisodeNumber: number,
    episodesList: MediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[],
    episodesOnImdb: ImdbEpisode[] | undefined
}

function EpisodesSideListContainer({ source, mediaId, vidsrcId, activeEpisodeNumber, episodesList, episodesOnImdb }: ComponentTypes) {

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

    useEffect(() => {

        // focus list item that correspond to current episode on page
        const centerActiveEpisode = () => {
            const elementActive = document.querySelector("li[data-active=true]")

            elementActive?.scrollIntoView()

            window.scrollTo({ top: 0, behavior: 'instant' })
        }

        setTimeout(centerActiveEpisode, 500)

    }, [activeEpisodeNumber])

    function queryLinkBySource(item: EpisodeAnimeWatch | MediaEpisodes, source: string) {

        switch (source) {

            case "gogoanime":

                return `${(item as MediaEpisodes).id}`

            case "aniwatch":

                return `${(item as EpisodeAnimeWatch).episodeId}`

            case "vidsrc":

                return `${vidsrcId}?s=1&e=${item.number}`

            default:

                return null

        }

    }

    return (
        <div id={styles.episodes_list_container}>

            <div className={styles.heading_container}>
                <h3>EPISODES</h3>

                <p>on {(source).toUpperCase()}</p>
            </div>

            <motion.ol
                id={styles.list_container}
                variants={loadingEpisodesMotion}
                initial="initial"
                animate="animate"
            >


                {episodesList?.map((item, key: number) => (
                    <motion.li
                        key={key}
                        data-active={(item as MediaEpisodes).number == activeEpisodeNumber}
                        variants={loadingEpisodesMotion}
                    >

                        <Link
                            title={`Episode ${(item as MediaEpisodes).number}`}
                            href={`/watch/${mediaId}?source=${source}&episode=${(item as MediaEpisodes).number}&q=${queryLinkBySource((item as MediaEpisodes), source)}`}
                        >

                            <div className={styles.img_container}>
                                <span>{(item as MediaEpisodes).number}</span>
                            </div>

                        </Link>

                        <div className={styles.episode_info_container}>

                            <Link
                                href={`/watch/${mediaId}?source=${source}&episode=${(item as MediaEpisodes).number}&q=${queryLinkBySource((item as MediaEpisodes), source)}`
                                }
                            >
                                <h4>
                                    {source == "gogoanime" || source == "vidsrc" ?
                                        episodesOnImdb ?
                                            episodesOnImdb[key].title : `Episode ${(item as MediaEpisodes).number}`
                                        :
                                        (item as EpisodeAnimeWatch).title}
                                </h4>
                            </Link>

                            <ButtonMarkEpisodeAsWatched
                                episodeId={source == "aniwatch" ? `${(item as MediaEpisodes).number}` : (item as MediaEpisodes).id}
                                episodeTitle={source == "vidsrc" || source == "aniwatch" ? (item as ImdbEpisode).title : `${(item as MediaEpisodes).number}`}
                                mediaId={mediaId}
                                source={source}
                                hasText={true}
                            />

                        </div>

                    </motion.li>
                ))}

            </motion.ol>

        </div >
    )
}

export default EpisodesSideListContainer