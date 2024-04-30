"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import Link from 'next/link'
import ButtonMarkEpisodeAsWatched from '@/app/components/ButtonMarkEpisodeAsWatched'
import { EpisodeAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import { motion } from 'framer-motion'
import { ImdbEpisode } from '@/app/ts/interfaces/apiImdbInterface'
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface'
import { doc, DocumentData, DocumentSnapshot, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { convertFromUnix } from '@/app/lib/formatDateUnix'

type ComponentTypes = {
    source: SourceType["source"],
    mediaId: number,
    activeEpisodeNumber: number,
    episodesList: MediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[],
    episodesOnImdb: ImdbEpisode[] | undefined,
    nextAiringEpisode?: { episode: number, airingAt: number }
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

function EpisodesSideListContainer({ source, mediaId, activeEpisodeNumber, episodesList, nextAiringEpisode, episodesOnImdb }: ComponentTypes) {

    const [currEpisodesWatched, setCurrEpisodesWatched] = useState<{
        mediaId: number;
        episodeId: string;
        episodeTitle: string;
    }[]>()

    const auth = getAuth()
    const [user] = useAuthState(auth)
    const db = getFirestore(initFirebase())

    // CHECK WATCHED EPISODES ON FIRESTORE
    async function getEpisodesWatched(source: SourceType["source"]) {

        if (!user) return

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return

        const isOnEpisodesList = userDoc.get("episodesWatchedBySource")?.[source]

        if (!isOnEpisodesList) return

        const watchedEpisodes = isOnEpisodesList[mediaId] || null

        console.log(watchedEpisodes)
        if (watchedEpisodes) setCurrEpisodesWatched(watchedEpisodes)

    }

    function queryLinkBySource(item: EpisodeAnimeWatch | MediaEpisodes, source: SourceType["source"]) {

        switch (source) {

            case "gogoanime":

                return `${(item as MediaEpisodes).id}`

            case "aniwatch":

                return `${(item as EpisodeAnimeWatch).episodeId}`

            default:

                return null

        }

    }

    // FETCHS EPISODES WATCHED 
    useEffect(() => {

        if (user) getEpisodesWatched(source)

    }, [user, mediaId, source])

    // FOCUS ON ITEM LIST WHICH CORRESPOND TO EPISODE ID
    useEffect(() => {

        // focus list item that correspond to current episode on page
        const centerActiveEpisode = () => {
            const elementActive = document.querySelector("li[data-active=true]")

            elementActive?.scrollIntoView()

            window.scrollTo({ top: 0, behavior: 'instant' })
        }

        setTimeout(centerActiveEpisode, 500)

    }, [activeEpisodeNumber])

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

                                {(source == "aniwatch" && (item as EpisodeAnimeWatch).isFiller) && (
                                    <small className={styles.filler_alert_text}>Filler</small>
                                )}

                                <h4>
                                    {source == "gogoanime" ?
                                        episodesOnImdb ?
                                            episodesOnImdb[key].title : `Episode ${(item as MediaEpisodes).number}`
                                        :
                                        (item as EpisodeAnimeWatch).title
                                    }
                                </h4>

                            </Link>

                            <ButtonMarkEpisodeAsWatched
                                episodeId={source == "aniwatch" ? `${(item as MediaEpisodes).number}` : (item as MediaEpisodes).id}
                                episodeTitle={source == "aniwatch" ? (item as ImdbEpisode).title : `${(item as MediaEpisodes).number}`}
                                mediaId={mediaId}
                                source={source}
                                hasText={true}
                                wasWatched={
                                    currEpisodesWatched?.find(
                                        (item2) => item2.episodeId == `${(item as any).number}`
                                    ) ? true : false
                                }
                            />

                        </div>

                    </motion.li>
                ))}

                {nextAiringEpisode && (
                    <motion.li
                        data-active={false}
                        variants={loadingEpisodesMotion}
                        className={styles.next_episode_container}
                    >

                        <Link
                            title={`Episode ${nextAiringEpisode.episode}`}
                            href={`/media/${mediaId}`}
                        >

                            <div className={styles.img_container}>
                                <span>{nextAiringEpisode.episode}</span>
                            </div>

                        </Link>

                        <div className={styles.episode_info_container}>
                            <Link href={`/media/${mediaId}`}>

                                <h4>Episode {nextAiringEpisode.episode}</h4>

                                <small>On {convertFromUnix(nextAiringEpisode.airingAt)}</small>

                            </Link>
                        </div>

                    </motion.li>
                )}

            </motion.ol>

        </div >
    )
}

export default EpisodesSideListContainer