"use client"
import React, { useEffect, useState } from 'react'
import PlaySvg from "@/public/assets/play2.svg"
import LoadingSvg from "@/public/assets/Eclipse-1s-200px-custom-color.svg"
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/app/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { DocumentData, DocumentSnapshot, doc, getDoc, getFirestore } from 'firebase/firestore'
import { fetchWithAniWatch, fetchWithGoGoAnime } from '@/app/lib/fetchAnimeOptions'
import styles from "./component.module.css"
import { motion } from 'framer-motion'
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import { EpisodeAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'

function PlayBtn({ mediaId, mediaTitle }: { mediaId: number, mediaTitle: string }) {

    const [movieId, setMovieId] = useState<string | null>("")
    const [episodeNumber, setEpisodeNumber] = useState<number>()
    const [episodeLastStop, setEpisodeLastStop] = useState<number>()
    const [episodeDuration, setEpisodeDuration] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [source, setSource] = useState<string>()

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    // CHECK LAST EPISODE WATCHED BY DESCRECENT ORDER 
    async function checkEpisodesMarkedAsWatched() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return fetchMediaWatchUrl()

        // VERIFY ON USER DOC "KEEP WATCHING" ANY EPISODE OF THIS MEDIA
        const onKeepWatching = await checkKeepWatchingList()

        if (onKeepWatching) return

        let episodedWatched

        // VERIFY ON GOGOANIME
        const isOnEpisodesListGoGoAnime = userDoc.get("episodesWatchedBySource")?.gogoanime

        if (isOnEpisodesListGoGoAnime) setSource("gogoanime")

        const mediaOnDb = isOnEpisodesListGoGoAnime && isOnEpisodesListGoGoAnime[mediaId]

        if (mediaOnDb != undefined) {

            // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX
            episodedWatched = isOnEpisodesListGoGoAnime[mediaId].sort(
                function (a: { episodeTitle: number }, b: { episodeTitle: number }) {
                    return b.episodeTitle - a.episodeTitle
                }
            )

        }

        // IF IS NOT ON GOGOANIME, TRY WITH ANIWATCH
        if (!episodedWatched || episodedWatched.length == 0) {

            const isOnEpisodesListAnimeWatch = userDoc.get("episodesWatchedBySource")?.aniwatch

            if (isOnEpisodesListAnimeWatch) setSource("aniwatch")

            const mediaOnDb = isOnEpisodesListAnimeWatch && isOnEpisodesListAnimeWatch[mediaId]

            if (mediaOnDb != undefined) {

                // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX
                episodedWatched = isOnEpisodesListAnimeWatch[mediaId].sort(
                    function (a: { episodeTitle: number }, b: { episodeTitle: number }) {
                        return b.episodeTitle - a.episodeTitle
                    }
                )

            }

        }

        // IF NO EPISODE WATCHED, IT FETCHS THE MEDIA'S FIRST EPISODE 
        if (!episodedWatched || episodedWatched.length == 0) return fetchMediaWatchUrl()

        // CALL OTHER FUNCTION TO FETCH URL
        fetchMediaWatchUrl(episodedWatched[0].episodeTitle) // EPISODE TITLE HAS THE EPISODE NUMBER

    }

    // IF NO EPISODE FOUND ON "EPISODES WATCHED",
    // IT VERIFIES LAST EPISODE ON "KEEP WATCHING"
    async function checkKeepWatchingList() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        let keepWatchingList = await userDoc.get("keepWatching")

        let listFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = listFromObjectToArray.filter(item => item.length != 0 && item)

        const lastWatchedEpisode: KeepWatchingItem = keepWatchingList.find((item: KeepWatchingItem) => item.id == mediaId)

        if (!lastWatchedEpisode) return null

        setSource(lastWatchedEpisode.source)
        setMovieId(lastWatchedEpisode.episodeId)
        setEpisodeNumber(Number(lastWatchedEpisode.episode))
        setEpisodeDuration(lastWatchedEpisode.episodeDuration)
        setEpisodeLastStop(lastWatchedEpisode.episodeTimeLastStop)

        return lastWatchedEpisode

    }

    // if its a ANIME, get ID for the first episode of this media / if MOVIE, get movie ID  
    async function fetchMediaWatchUrl(lastEpisodeWatched?: number) {

        setIsLoading(true)

        async function fetchOnGoGoAnime() {

            const searchResultsForMedia = fetchWithGoGoAnime(mediaTitle, "episodes")

            setSource("gogoanime")

            return searchResultsForMedia

        }

        async function fetchOnAniWatch() {

            const searchResultsForMedia = fetchWithAniWatch(mediaTitle, "episodes")

            setSource("aniwatch")

            return searchResultsForMedia

        }

        // try first with animewatch
        let media: MediaEpisodes[] | EpisodeAnimeWatch[]

        media = await fetchOnGoGoAnime() as MediaEpisodes[]

        // if media is null, try with gogoanime
        if (!media) {

            media = await fetchOnAniWatch() as EpisodeAnimeWatch[] // High chances of getting the wrong media

            if (!media) {
                setIsLoading(false)
                setMovieId(null)

                return
            }

        }

        // if user has watched a episode and the episode is NOT the last, redirects to next episode
        if (media && lastEpisodeWatched && (media.length > lastEpisodeWatched)) {

            // add 1 to get the next episode after the last watched
            const episodeSelected = media.find((item: { number: number }) => item.number == lastEpisodeWatched + 1)

            if (episodeSelected) {

                setMovieId(source == "gogoanime" ? (episodeSelected as MediaEpisodes)!.id : (episodeSelected as EpisodeAnimeWatch)!.episodeId)

                // adds 1 to get the next episode after the last watched
                setEpisodeNumber(lastEpisodeWatched + 1)

                setIsLoading(false)

                return

            }
        }

        if (media) {

            setMovieId((media[0] as EpisodeAnimeWatch)?.episodeId || (media[0] as MediaEpisodes)?.id || null)

        }

        setIsLoading(false)

    }

    useEffect(() => {

        (user && !loading) ? checkEpisodesMarkedAsWatched() : fetchMediaWatchUrl()

    }, [user, episodeNumber])

    useEffect(() => {

        if (mediaId && source && movieId) setIsLoading(false)

    }, [mediaId, source, episodeNumber, movieId])

    return (
        <motion.button
            id={styles.container}
            role='link'
            onClick={() => {

                setIsLoading(true)

                router.push(`/watch/${mediaId}?source=${source}&episode=${episodeNumber || 1}&q=${movieId}${episodeNumber ? `&t=${episodeLastStop}` : ""}`)

            }}
            disabled={isLoading || movieId == null}
            aria-label={episodeNumber ? `Continue Episode ${episodeNumber}` : "Watch Episode 1"}
            title={isLoading ?
                "Loading" : movieId == null ?
                    "Not Available At This Moment"
                    :
                    `Watch ${episodeNumber ? `Episode ${episodeNumber} - ${mediaTitle} ` : ""}`
            }
        >

            {/* SHOWS PROGRESS OF EPISODE WATCHED */}
            {(episodeLastStop != null && episodeDuration != null) && (
                <motion.div className={styles.progress_bar}>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: (((episodeLastStop / episodeDuration) * 100) / 100) || 0.07 }}
                        transition={{ duration: 1 }}
                    />
                </motion.div>
            )}

            {(user && episodeNumber) && (
                <span id={styles.continue_span}>EPISODE {episodeNumber}</span>
            )}

            {isLoading ?
                <LoadingSvg fill="#fff" width={16} height={16} />
                :
                <PlaySvg fill="#fff" width={16} height={16} />
            }

            {(movieId && source) && (
                <span id={styles.source_span}>{source.toUpperCase()}</span>
            )}

        </motion.button>
    )
}

export default PlayBtn