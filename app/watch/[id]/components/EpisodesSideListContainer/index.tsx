"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import gogoanime from '@/api/gogoanime'
import Link from 'next/link'
import Image from 'next/image'
import ButtonMarkEpisodeAsWatched from '@/app/components/ButtonMarkEpisodeAsWatched'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'
import aniwatch from '@/api/aniwatch'
import { EpisodeAnimeWatch, EpisodesFetchedAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'

type ComponentTypes = {
    source: string,
    mediaId: number,
    mediaTitle: string,
    activeEpisodeNumber: number,
    sourceMediaId: string
}

function EpisodesSideListContainer({ source, mediaId, mediaTitle, activeEpisodeNumber, sourceMediaId }: ComponentTypes) {

    const [mediaData, setMediaData] = useState<MediaInfo | EpisodesFetchedAnimeWatch>()
    const [episodesList, setEpisodesList] = useState<MediaEpisodes[] | EpisodeAnimeWatch[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function loadData() {

        setIsLoading(true)
        const query = mediaTitle

        let response

        if (source == "gogoanime") {
            response = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo

            if (response == null) {
                const searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(query), "anime") as MediaSearchResult[]

                // try to found a result that matches the title from anilist on gogoanime (might work in some cases)
                const closestResult = searchResultsForMedia.find((item) => item.id.includes(query + "-tv"))

                response = await gogoanime.getInfoFromThisMedia(closestResult?.id || searchResultsForMedia[0].id, "anime") as MediaInfo
            }
        }
        else {

            response = await aniwatch.getEpisodes(sourceMediaId.slice(0, sourceMediaId.length - 1)) as EpisodesFetchedAnimeWatch

        }

        setMediaData(response)
        setEpisodesList(response.episodes)

        setIsLoading(false)

    }

    useEffect(() => {

        // focus list item that correspond to current episode on page
        if (!isLoading) {
            const elementActive = document.querySelector("li[data-active=true]")
            elementActive?.scrollIntoView()

            window.scrollTo({ top: 0, behavior: 'instant' })
        }

        if (episodesList.length == 0) loadData()

    }, [mediaTitle, isLoading, activeEpisodeNumber])

    return (
        <div id={styles.episodes_list_container}>

            <h3>EPISODES</h3>

            <ol id={styles.list_container} data-loading={isLoading}>

                {isLoading && (
                    <>
                        <li className={styles.item_placeholder}></li>
                        <li className={styles.item_placeholder}></li>
                        <li className={styles.item_placeholder}></li>
                        <li className={styles.item_placeholder}></li>
                    </>
                )}

                {isLoading == false && (

                    episodesList?.map((item, key: number) => (
                        <li key={key} data-active={(item as MediaEpisodes).number == activeEpisodeNumber}>

                            <Link
                                href={`/watch/${mediaId}?source=${source}&episode=${item.number}&q=${source == "gogoanime" ? (item as MediaEpisodes).id : (item as EpisodeAnimeWatch).episodeId}`}
                            >

                                <div className={styles.img_container}>
                                    {source == "gogoanime" ? (
                                        <Image src={(mediaData as MediaInfo)?.image as string} alt={(mediaData as MediaInfo)?.title as string} fill></Image>
                                    ) : (
                                        <span>{item.number}</span>
                                    )}
                                </div>

                            </Link>

                            <div className={styles.episode_info_container}>

                                <Link
                                    href={`/watch/${mediaId}?source=${source}&episode=${item.number}&q=${source == "gogoanime" ? (item as MediaEpisodes).id : (item as EpisodeAnimeWatch).episodeId}`}
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

                        </li>
                    ))
                )}

            </ol>

        </div >
    )
}

export default EpisodesSideListContainer