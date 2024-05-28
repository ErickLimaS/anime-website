"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import PlaySvg from "@/public/assets/play2.svg"
import LoadingSvg from "@/public/assets/Eclipse-1s-200px-custom-color.svg"
import { useRouter } from 'next/navigation'
import { getAuth, User } from 'firebase/auth'
import { initFirebase } from '@/app/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { optimizedFetchOnAniwatch, optimizedFetchOnGoGoAnime } from '@/app/lib/optimizedFetchAnimeOptions'
import { motion } from 'framer-motion'
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import { EpisodeAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'

export default function PlayBtn({ mediaId, mediaTitle }: { mediaId: number, mediaTitle: string }) {

    const [movieId, setMovieId] = useState<string | null>("")
    const [episodeNumber, setEpisodeNumber] = useState<number>()
    const [episodeLastStop, setEpisodeLastStop] = useState<number>()
    const [episodeDuration, setEpisodeDuration] = useState<number>()

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [sourceName, setSourceName] = useState<string>()

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    useEffect(() => {

        if (user && !loading) handleEpisodesMarkedAsWatched()
        else fetchMediaEpisodeUrl()

    }, [user, episodeNumber])

    useEffect(() => {

        if (mediaId && sourceName && movieId) setIsLoading(false)

    }, [mediaId, sourceName, episodeNumber, movieId])

    async function handleEpisodesMarkedAsWatched() {

        const userDoc = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return fetchMediaEpisodeUrl()

        const lastEpisodeWatched = await checkIfMediaIsOnKeepWatchingList()

        if (lastEpisodeWatched) return // Priority for Keep Watching Episodes

        const episodesWatchedList = userDoc.get("episodesWatched")

        const userPreferredSource = userDoc.get("videoSource") || "gogoanime"

        if (episodesWatchedList) setSourceName(userPreferredSource)

        if (episodesWatchedList[mediaId]) {

            // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX
            const lastestEpisodeMarkedAsWatched = episodesWatchedList[mediaId].sort(
                function (a: { episodeTitle: number }, b: { episodeTitle: number }) {
                    return b.episodeTitle - a.episodeTitle
                }
            )

            fetchMediaEpisodeUrl(lastestEpisodeMarkedAsWatched[0].episodeTitle) // EPISODE TITLE HAS THE EPISODE NUMBER

        }

        // IF NO EPISODE WATCHED, IT FETCHS THE MEDIA'S FIRST EPISODE 
        return fetchMediaEpisodeUrl()

    }

    async function checkIfMediaIsOnKeepWatchingList() {

        const userDoc = await getDoc(doc(db, 'users', user!.uid))

        let userKeepWatchingList = await userDoc.get("keepWatching")

        let listFromObjectToArray = Object.keys(userKeepWatchingList).map(key => {

            return userKeepWatchingList[key]

        })

        userKeepWatchingList = listFromObjectToArray.filter(item => item.length != 0 && item)

        const mediaLastEpisodeWatched: KeepWatchingItem = userKeepWatchingList.find((item: KeepWatchingItem) => item.id == mediaId)

        if (!mediaLastEpisodeWatched) return null

        setSourceName(mediaLastEpisodeWatched.source)
        setMovieId(mediaLastEpisodeWatched.episodeId)
        setEpisodeNumber(Number(mediaLastEpisodeWatched.episode))
        setEpisodeDuration(mediaLastEpisodeWatched.episodeDuration)
        setEpisodeLastStop(mediaLastEpisodeWatched.episodeTimeLastStop)

        return mediaLastEpisodeWatched

    }

    async function fetchMediaEpisodeUrl(lastEpisodeWatchedNumber?: number) {

        setIsLoading(true)

        async function fetchOnGoGoAnime() {

            const searchResultsForMedia = optimizedFetchOnGoGoAnime({ textToSearch: mediaTitle, only: "episodes" })

            setSourceName("gogoanime")

            return searchResultsForMedia

        }

        async function fetchOnAniWatch() {

            const searchResultsForMedia = optimizedFetchOnAniwatch({ textToSearch: mediaTitle, only: "episodes" })

            setSourceName("aniwatch")

            return searchResultsForMedia

        }

        let currMediaInfo: MediaEpisodes[] | EpisodeAnimeWatch[] = await fetchOnGoGoAnime() as MediaEpisodes[]

        if (!currMediaInfo) currMediaInfo = await fetchOnAniWatch() as EpisodeAnimeWatch[] // High chances of getting the wrong media

        if (!currMediaInfo) {

            setIsLoading(false)
            setMovieId(null)

            return

        }

        // if user has watched a episode and the episode is NOT the last, redirects to the next episode
        if (lastEpisodeWatchedNumber && (currMediaInfo.length > lastEpisodeWatchedNumber)) {

            // adds 1 to get the next episode after the last watched
            const nextEpisodeAfterLastWatched = currMediaInfo.find((episode: { number: number }) => episode.number == lastEpisodeWatchedNumber + 1)

            if (nextEpisodeAfterLastWatched) {

                setMovieId(sourceName == "gogoanime" ? (nextEpisodeAfterLastWatched as MediaEpisodes)!.id : (nextEpisodeAfterLastWatched as EpisodeAnimeWatch)!.episodeId)

                // adds 1 to get the next episode after the last watched
                setEpisodeNumber(lastEpisodeWatchedNumber + 1)

                setIsLoading(false)

                return

            }
        }

        if (currMediaInfo) setMovieId((currMediaInfo[0] as EpisodeAnimeWatch)?.episodeId || (currMediaInfo[0] as MediaEpisodes)?.id || null)

        setIsLoading(false)

    }

    function handlePlayBtn() {

        setIsLoading(true)

        const mediaPathname = `/watch/${mediaId}?source=${sourceName}&episode=${episodeNumber || 1}&q=${movieId}${episodeNumber ? `&t=${episodeLastStop}` : ""}`

        router.push(mediaPathname)

    }

    return (
        <motion.button
            id={styles.container}
            role='link'
            onClick={() => handlePlayBtn()}
            disabled={isLoading || movieId == null}
            aria-label={episodeNumber ? `Continue Episode ${episodeNumber}` : "Watch Episode 1"}
            title={isLoading ?
                "Loading" : movieId == null ?
                    "Not Available At This Moment"
                    :
                    `Watch ${episodeNumber ? `Episode ${episodeNumber} - ${mediaTitle} ` : mediaTitle}`
            }
        >

            <ProgressBar
                episodeDuration={episodeDuration}
                episodeLastStop={episodeLastStop}
            />

            <EpisodeNumber
                user={user}
                episodeNumber={episodeNumber}
            />

            {isLoading ?
                <LoadingSvg fill="#fff" width={16} height={16} />
                :
                <PlaySvg fill="#fff" width={16} height={16} />
            }

            <SourceName
                movieId={movieId}
                sourceName={sourceName}
            />

        </motion.button>
    )
}

function ProgressBar({ episodeLastStop, episodeDuration }: { episodeLastStop: number | undefined, episodeDuration: number | undefined }) {

    const isActive = (episodeLastStop && episodeDuration) ? true : false

    return (
        isActive && (
            <motion.div className={styles.progress_bar}>
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (((episodeLastStop! / episodeDuration!) * 100) / 100) || 0.07 }}
                    transition={{ duration: 1 }}
                />
            </motion.div>
        )
    )

}

function EpisodeNumber({ user, episodeNumber }: { user: User | null | undefined, episodeNumber: number | undefined }) {
    return (
        ((user && episodeNumber) && (
            <span id={styles.continue_span}>
                EPISODE {episodeNumber}
            </span>
        ))
    )
}

function SourceName({ movieId, sourceName }: { movieId: string | null, sourceName: string | undefined }) {
    return (
        (movieId && sourceName) && (
            <span id={styles.source_span}>
                {sourceName.toUpperCase()}
            </span>
        )
    )
}