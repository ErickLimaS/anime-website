"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import gogoanime from '@/api/gogoanime'
import Link from 'next/link'
import ButtonMarkEpisodeAsWatched from '@/app/components/ButtonMarkEpisodeAsWatched'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'
import aniwatch from '@/api/aniwatch'
import { EpisodeAnimeWatch, EpisodesFetchedAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import simulateRange from '@/app/lib/simulateRange'
import { motion } from 'framer-motion'

type ComponentTypes = {
    source: string,
    mediaId: number,
    mediaTitle: string,
    activeEpisodeNumber: number,
    sourceMediaId: string,
    totalEpisodes?: number
}

function EpisodesSideListContainer({ source, mediaId, mediaTitle, activeEpisodeNumber, sourceMediaId, totalEpisodes }: ComponentTypes) {

    const [episodesList, setEpisodesList] = useState<MediaEpisodes[] | EpisodeAnimeWatch[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function loadData() {

        setIsLoading(true)
        const query = mediaTitle

        let response: MediaInfo | EpisodesFetchedAnimeWatch | { episodes: MediaEpisodes[] } | null

        if (source == "gogoanime") {

            response = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo
            let searchResultsForMedia: any[]
            let closestResult: MediaSearchResult | undefined

            if (response == null) {
                searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(query), "anime") as MediaSearchResult[]

                // try to found a result that matches the title from anilist on gogoanime (might work in some cases)
                closestResult = searchResultsForMedia.find((item) => item.id.includes(query + "-tv"))

                response = await gogoanime.getInfoFromThisMedia(closestResult?.id || searchResultsForMedia[0].id, "anime") as MediaInfo

            }

            // work around the api not return episodes
            if (response.episodes.length == 0) {

                const episodes: MediaEpisodes[] = []

                simulateRange(totalEpisodes as number).map((item, key) => (

                    episodes.push({
                        number: key + 1,
                        id: `${((response as MediaInfo)?.id || closestResult?.id || searchResultsForMedia[0].id).toLowerCase()}-episode-${key + 1}`,
                        url: ""
                    })

                ))

                response = { episodes: episodes }

            }
        }
        else {

            response = await aniwatch.getEpisodes(sourceMediaId.slice(0, sourceMediaId.length - 1)) as EpisodesFetchedAnimeWatch

        }

        setEpisodesList(response!.episodes)

        setIsLoading(false)

    }

    const loadingEpisodesMotion = {
        initial: {
            scale: 0,
        },
        animate: {
            scale: 1,
            transition: {
                staggerChildren: 0.1,
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

        if (!isLoading) {
            setTimeout(centerActiveEpisode, 500)
        }

    }, [isLoading, activeEpisodeNumber])

    useEffect(() => {

        if (episodesList.length == 0) loadData()

    }, [mediaTitle, activeEpisodeNumber])

    return (
        <div id={styles.episodes_list_container}>

            <h3>EPISODES</h3>

            <motion.ol
                id={styles.list_container}
                data-loading={isLoading}
                variants={loadingEpisodesMotion}
                initial="initial"
                animate="animate"
            >
                {isLoading && (
                    simulateRange(8).map((item, key) => (
                        <motion.li className={styles.item_placeholder} key={key} variants={loadingEpisodesMotion}></motion.li>
                    )))
                }

                {!isLoading && (

                    episodesList?.map((item, key: number) => (
                        <motion.li
                            key={key}
                            data-active={(item as MediaEpisodes).number == activeEpisodeNumber}
                            variants={loadingEpisodesMotion}
                        >

                            <Link
                                title={`Episode ${item.number}`}
                                href={`/watch/${mediaId}?source=${source}&episode=${item.number}&q=${source == "gogoanime" ?
                                    (item as MediaEpisodes).id : (item as EpisodeAnimeWatch).episodeId}`
                                }
                            >

                                <div className={styles.img_container}>
                                    <span>{item.number}</span>
                                </div>

                            </Link>

                            <div className={styles.episode_info_container}>

                                <Link
                                    href={`/watch/${mediaId}?source=${source}&episode=${item.number}&q=${source == "gogoanime" ?
                                        (item as MediaEpisodes).id : (item as EpisodeAnimeWatch).episodeId}`
                                    }
                                >
                                    <h4>{source == "gogoanime" ? `Episode ${(item as MediaEpisodes).number}` : (item as EpisodeAnimeWatch).title}</h4>
                                </Link>

                                <ButtonMarkEpisodeAsWatched
                                    data={item}
                                    mediaId={mediaId}
                                    source={source}
                                    hasText={true}
                                />

                            </div>

                        </motion.li>
                    ))
                )}

            </motion.ol>

        </div >
    )
}

export default EpisodesSideListContainer