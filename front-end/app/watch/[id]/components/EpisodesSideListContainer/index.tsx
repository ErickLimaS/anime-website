"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import gogoanime from '@/api/gogoanime'
import Link from 'next/link'
import Image from 'next/image'
import ButtonMarkEpisodeAsWatched from '@/app/components/ButtonMarkEpisodeAsWatched'

function EpisodesSideListContainer({ mediaId, mediaTitle, episodeId }: { mediaId: number, mediaTitle: string, episodeId: string }) {

    const [mediaData, setMediaData] = useState<MediaInfo>()
    const [episodesList, setEpisodesList] = useState<MediaEpisodes[]>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    async function loadData() {

        setIsLoading(true)
        const query = mediaTitle.replace(/[^a-z]+/i, ' ').split(" ").join("-").toLowerCase()

        let response = await gogoanime.getInfoFromThisMedia(query, "anime") as MediaInfo

        if (response == null) {
            const searchResultsForMedia = await gogoanime.searchMedia(query, "anime") as MediaSearchResult[]

            response = await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0].id, "anime") as MediaInfo
        }

        setMediaData(response)
        setEpisodesList(response.episodes)

        setIsLoading(false)

    }

    useEffect(() => {

        loadData()

    }, [mediaTitle])

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
                        <li key={key} data-active={item.id == episodeId}>

                            <Link href={`/watch/${mediaId}?q=${item.id}`}>

                                <div className={styles.img_container}>

                                    <Image src={mediaData?.image as string} alt={mediaData?.title as string} fill></Image>

                                </div>

                            </Link>

                            <div className={styles.episode_info_container}>

                                <Link href={`/watch/${mediaId}?q=${item.id}`}>
                                    <h4>Episode {item.number}</h4>

                                </Link>

                                <ButtonMarkEpisodeAsWatched data={item} mediaId={mediaId} source={'gogoanime'} hasText={true}/>

                            </div>

                        </li>
                    ))
                )}
            </ol>

        </div >
    )
}

export default EpisodesSideListContainer