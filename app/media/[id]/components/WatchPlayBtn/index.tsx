"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import pageStyles from "../../page.module.css"
import PlaySvg from "@/public/assets/play2.svg"
import LoadingSvg from "@/public/assets/Eclipse-1s-200px-custom-color.svg"
import { useRouter } from 'next/navigation'
import { getAuth, User } from 'firebase/auth'
import { initFirebase } from '@/app/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { optimizedFetchOnAniwatch, optimizedFetchOnGoGoAnime } from '@/app/lib/dataFetch/optimizedFetchAnimeOptions'
import { AnimatePresence, motion } from 'framer-motion'
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import { EpisodeAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import { useAppSelector } from '@/app/lib/redux/hooks'
import { KeepWatchingItem } from '@/app/ts/interfaces/firestoreDataInterface'
import DubbedCheckboxButton from '../AnimeEpisodesContainer/components/ActiveDubbButton'
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface'

export default function PlayBtn({ mediaId, mediaTitle, mediaFormat }: { mediaId: number, mediaTitle: string, mediaFormat: string }) {

    const [episodeId, setEpisodeId] = useState<string | null>("")
    const [episodeNumber, setEpisodeNumber] = useState<number>()
    const [episodeLastStop, setEpisodeLastStop] = useState<number>()
    const [episodeDuration, setEpisodeDuration] = useState<number>()

    const [isDubbedActive, setIsDubbedActive] = useState<boolean>(false)

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [sourceName, setSourceName] = useState<SourceType["source"]>()

    const anilistUser = useAppSelector((state) => (state.UserInfo).value)

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    const sourceOptions = [
        { name: "GoGoAnime", value: "gogoanime" },
        { name: "Aniwatch", value: "aniwatch" }
    ]

    useEffect(() => {

        if (anilistUser || (user && !loading)) handleEpisodesMarkedAsWatched()
        else fetchMediaEpisodeUrl({ hasUser: anilistUser || user ? true : false })

    }, [user, anilistUser, episodeNumber])

    useEffect(() => {

        if (sourceName) fetchMediaEpisodeUrl({ source: sourceName })

    }, [sourceName, isDubbedActive])

    useEffect(() => {

        if (mediaId && episodeId) setIsLoading(false)

    }, [mediaId, episodeNumber, episodeId])

    useEffect(() => {

        if (typeof window !== 'undefined') {

            setIsDubbedActive(localStorage.getItem("dubEpisodes") == "true")

        }

    }, [typeof window])

    async function handleEpisodesMarkedAsWatched() {

        const userDoc = await getDoc(doc(db, 'users', user?.uid || `${anilistUser?.id}`))

        if (!userDoc) {

            fetchMediaEpisodeUrl({})

            return
        }

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
        return fetchMediaEpisodeUrl({ source: episodesWatchedList })

    }

    async function checkIfMediaIsOnKeepWatchingList() {

        const userDoc = await getDoc(doc(db, 'users', user?.uid || `${anilistUser?.id}`))

        let userKeepWatchingList = await userDoc.get("keepWatching")

        let listFromObjectToArray = Object.keys(userKeepWatchingList).map(key => {

            return userKeepWatchingList[key]

        })

        userKeepWatchingList = listFromObjectToArray.filter(item => item.length != 0 && item)

        const mediaLastEpisodeWatched: KeepWatchingItem = userKeepWatchingList.find((item: KeepWatchingItem) => item.id == mediaId)

        if (!mediaLastEpisodeWatched) return null

        setSourceName(mediaLastEpisodeWatched.source)
        setEpisodeId(mediaLastEpisodeWatched.episodeId)
        setEpisodeNumber(Number(mediaLastEpisodeWatched.episode))
        setEpisodeDuration(mediaLastEpisodeWatched.episodeDuration)
        setEpisodeLastStop(mediaLastEpisodeWatched.episodeTimeLastStop)

        return mediaLastEpisodeWatched

    }

    async function fetchMediaEpisodeUrl({ hasUser, lastEpisodeWatchedNumber, source }: { hasUser?: boolean, lastEpisodeWatchedNumber?: number, source?: string }) {

        setIsLoading(true)

        if (hasUser) {
            const userDoc = await getDoc(doc(db, 'users', user?.uid || `${anilistUser?.id}`))

            const userPreferredSource = userDoc.get("videoSource") || "gogoanime"

            source = userPreferredSource
        }

        async function fetchOnGoGoAnime() {

            const searchResultsForMedia = optimizedFetchOnGoGoAnime({
                textToSearch: mediaTitle,
                only: "episodes",
                isDubbed: isDubbedActive
            })

            setSourceName("gogoanime")

            return searchResultsForMedia

        }

        async function fetchOnAniWatch() {

            const searchResultsForMedia = optimizedFetchOnAniwatch({
                textToSearch: mediaTitle,
                only: "episodes",
                isDubbed: isDubbedActive,
                format: mediaFormat
            })

            setSourceName("aniwatch")

            return searchResultsForMedia

        }

        if (source) {

            let currMediaInfo: MediaEpisodes[] | EpisodeAnimeWatch[] | null = null

            switch (source) {

                case "gogoanime":

                    currMediaInfo = await fetchOnGoGoAnime() as MediaEpisodes[]

                    break

                case "aniwatch":

                    currMediaInfo = await fetchOnAniWatch() as EpisodeAnimeWatch[]

                    break

                default:

                    break


            }

            if (currMediaInfo) setEpisodeId((currMediaInfo[0] as EpisodeAnimeWatch)?.episodeId || (currMediaInfo[0] as MediaEpisodes)?.id || null)

            setIsLoading(false)

            return

        }

        let currMediaInfo: MediaEpisodes[] | EpisodeAnimeWatch[] = await fetchOnGoGoAnime() as MediaEpisodes[]

        if (!currMediaInfo) currMediaInfo = await fetchOnAniWatch() as EpisodeAnimeWatch[] // High chances of getting the wrong media

        if (!currMediaInfo) {

            setIsLoading(false)
            setEpisodeId(null)

            return

        }

        // if user has watched a episode and the episode is NOT the last, redirects to the next episode
        if (lastEpisodeWatchedNumber && (currMediaInfo.length > lastEpisodeWatchedNumber)) {

            // adds 1 to get the next episode after the last watched
            const nextEpisodeAfterLastWatched = currMediaInfo.find((episode: { number: number }) => episode.number == lastEpisodeWatchedNumber + 1)

            if (nextEpisodeAfterLastWatched) {

                setEpisodeId(sourceName == "gogoanime" ? (nextEpisodeAfterLastWatched as MediaEpisodes)!.id : (nextEpisodeAfterLastWatched as EpisodeAnimeWatch)!.episodeId)

                // adds 1 to get the next episode after the last watched
                setEpisodeNumber(lastEpisodeWatchedNumber + 1)

                setIsLoading(false)

                return

            }
        }

        if (currMediaInfo) setEpisodeId((currMediaInfo[0] as EpisodeAnimeWatch)?.episodeId || (currMediaInfo[0] as MediaEpisodes)?.id || null)

        setIsLoading(false)

    }

    function handlePlayBtn() {

        setIsLoading(true)

        const isDub = typeof window !== 'undefined' ? Boolean(localStorage.getItem('dubEpisodes')) : false

        const mediaPathname = `/watch/${mediaId}?source=${sourceName}&episode=${episodeNumber || 1}&q=${episodeId}${episodeNumber ? `&t=${episodeLastStop}` : ""}${isDub ? "&dub=true" : ""}`

        router.push(mediaPathname)

    }

    return (
        <React.Fragment>

            <li className={`${pageStyles.info_item} ${pageStyles.action_btn}`}>
                <motion.button
                    id={styles.container}
                    role='link'
                    onClick={() => handlePlayBtn()}
                    disabled={isLoading || episodeId == null}
                    aria-label={episodeNumber ? `Continue Episode ${episodeNumber}` : "Watch Episode 1"}
                    title={isLoading ?
                        "Loading" : episodeId == null ?
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
                        user={user || anilistUser}
                        episodeNumber={episodeNumber}
                        mediaFormat={mediaFormat}
                    />

                    {isLoading ?
                        <LoadingSvg fill="#fff" width={16} height={16} />
                        :
                        <PlaySvg fill="#fff" width={16} height={16} />
                    }

                    <SourceName
                        movieId={episodeId}
                        sourceName={sourceName}
                    />

                </motion.button>
            </li>

            {mediaFormat == "MOVIE" && (
                <li className={`${pageStyles.info_item}`}>
                    <h2>MOVIE</h2>

                    <div id={styles.movie_options_settings_container}>

                        <DubbedCheckboxButton
                            isDubActive={isDubbedActive}
                            clickAction={() => setIsDubbedActive(!isDubbedActive)}
                            styleRow
                        />

                        <AnimatePresence>
                            {sourceName && (
                                <motion.label
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                >
                                    Source
                                    <select
                                        defaultValue={sourceName}
                                        onChange={(e) => setSourceName(e.target.value as SourceType["source"])}
                                    >
                                        {sourceOptions.map((source) => (
                                            <option value={source.value} key={source.value}>
                                                {source.name}
                                            </option>
                                        ))}
                                    </select>
                                </motion.label>
                            )}
                        </AnimatePresence>

                    </div>

                </li>
            )}

        </React.Fragment>
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

function EpisodeNumber({ user, episodeNumber, mediaFormat }: { user: User | UserAnilist | null | undefined, mediaFormat: string, episodeNumber: number | undefined }) {
    return (
        ((user && episodeNumber) && (

            mediaFormat == "MOVIE" ? (
                <span id={styles.continue_span}>
                    CONTINUE
                </span>
            ) : (
                <span id={styles.continue_span}>
                    EPISODE {episodeNumber}
                </span>
            )

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