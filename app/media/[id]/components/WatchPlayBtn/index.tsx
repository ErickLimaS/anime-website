"use client"
import React, { useEffect, useState } from 'react'
import PlaySvg from "@/public/assets/play2.svg"
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg"
import gogoanime from '@/api/gogoanime'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'
import { MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/firebase/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { DocumentData, DocumentSnapshot, doc, getDoc, getFirestore } from 'firebase/firestore'
import aniwatch from '@/api/aniwatch'
import { EpisodesFetchedAnimeWatch, MediaInfoFetchedAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import simulateRange from '@/app/lib/simulateRange'

function PlayBtn({ mediaId, mediaTitle }: { mediaId: number, mediaTitle: string }) {

    const [movieId, setMovieId] = useState<string>("")
    const [episodeNumber, setEpisodeNumber] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [source, setSource] = useState<string>()

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    // CHECK LAST EPISODE WATCHED BY DESCRECENT ORDER 
    async function checkLastEpisodeWatched() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return fetchMediaWatchUrl()

        let episodedWatched

        // CHECKS ON GOGOANIME FIRST
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

            // IF NO RESULTS ON ANIWATCH, CHECK "KEEP WATCHING LIST"
            if (!episodedWatched || episodedWatched.length == 0) {

                const onKeepWacthing = await checkKeepWatchingList()

                if (!onKeepWacthing) fetchMediaWatchUrl()

                return

            }
        }

        // CALL OTHER FUNCTION TO FETCH URL
        fetchMediaWatchUrl(episodedWatched[0].episodeTitle) // EPISODE TITLE HAS THE EPISODE NUMBER

    }

    // IF NO EPISODES FOUND ON "EPISODES WATCHED",
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

        return lastWatchedEpisode

    }

    async function fetchWithGoGoAnime() {

        const searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(mediaTitle), "anime").then((res) => {
            setSource("gogoanime")
            return res
        }) as MediaSearchResult[]

        const res = await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0]?.id, "anime") as MediaInfo || null

        if (!res) return null

        let episodes: any[] = []

        simulateRange(res.totalEpisodes).map((item, key) => {
            episodes.push({
                number: key + 1,
                id: `${res!.id.toLowerCase()}-episode-${key + 1}`,
                url: ""
            })
        })

        return res.episodes.length == 0 ?
            episodes
            :
            res.episodes

    }

    async function fetchWithAniWatch() {

        const searchResultsForMedia = await aniwatch.searchMedia(mediaTitle).then(
            (res: void | MediaInfoFetchedAnimeWatch) => {
                setSource("aniwatch")
                return res!.animes
            }
        )

        const closestResult = searchResultsForMedia.find((item) => item.name.includes(mediaTitle)) || searchResultsForMedia[0]

        const res = await aniwatch.getEpisodes(closestResult.id) as EpisodesFetchedAnimeWatch

        return res.episodes.length == 0 ? null : res.episodes
    }

    // if ANIME, get ID for the first episode of this media / if MOVIE, get movie ID  
    async function fetchMediaWatchUrl(lastEpisodeWatched?: number) {

        setIsLoading(true)

        // try first with animewatch
        let media: any = await fetchWithGoGoAnime()

        // if media is null, try with gogoanime
        if (!media) media = await fetchWithAniWatch() // High chances of getting the wrong media

        // if user has watched a episode and the episode is NOT the last, redirects to next episode
        if (media && lastEpisodeWatched && (media.length > lastEpisodeWatched)) {

            // add 1 to get the next episode after the last watched
            const episodeSelected = media.find((item: { number: number }) => item.number == lastEpisodeWatched + 1)

            if (episodeSelected) {

                setMovieId(source == "gogoanime" ? episodeSelected!.id : episodeSelected!.episodeId)

                setEpisodeNumber(lastEpisodeWatched + 1) // add 1 to get the next episode after the last watched

                setIsLoading(false)

                return

            }
        }

        if (media) {
            setMovieId(source == "aniwatch" ? media[0].episodeId : media[0].id)
        }

        setIsLoading(false)
    }

    // redirect to watch page
    function redirectTo() {

        router.push(`/watch/${mediaId}?source=${source}&episode=${episodeNumber || 1}&q=${movieId}`)

    }

    useEffect(() => {

        (user && !loading) ? checkLastEpisodeWatched() : fetchMediaWatchUrl()

    }, [user, episodeNumber])

    useEffect(() => {

        if (mediaId && source && movieId) setIsLoading(false)

    }, [mediaId, source, episodeNumber, movieId])

    return (
        <button
            role='link'
            onClick={() => redirectTo()}
            disabled={isLoading || movieId?.length == 0}
            title={isLoading ?
                "Wait the Loading"
                :
                `Watch ${mediaTitle} ${episodeNumber ? ` - EP ${episodeNumber}` : ""}`
            }
        >

            {(user && episodeNumber) && (
                <span>Continue from EP {episodeNumber}</span>
            )}

            {isLoading ?
                <LoadingSvg width={16} height={16} /> :
                <PlaySvg fill="#fff" width={16} height={16} />
            }

        </button>
    )
}

export default PlayBtn