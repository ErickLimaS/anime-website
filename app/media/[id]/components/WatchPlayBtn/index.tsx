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

        const isOnEpisodesListAnimeWatch = userDoc.get("episodesWatchedBySource")?.aniwatch

        if (isOnEpisodesListAnimeWatch) setSource("aniwatch")

        if (!isOnEpisodesListAnimeWatch) return fetchMediaWatchUrl()

        if (isOnEpisodesListAnimeWatch[mediaId] == undefined) return fetchMediaWatchUrl()

        // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX
        episodedWatched = isOnEpisodesListAnimeWatch[mediaId].sort(
            function (a: { episodeTitle: number }, b: { episodeTitle: number }) {
                return b.episodeTitle - a.episodeTitle
            }
        )

        // IF IS NOT ON ANIMEWATCH, TRY WITH GOGOANIME
        if (!episodedWatched) {

            const isOnEpisodesListGoGoAnime = userDoc.get("episodesWatchedBySource")?.gogoanime

            if (isOnEpisodesListGoGoAnime) setSource("gogoanime")

            if (!isOnEpisodesListGoGoAnime) return fetchMediaWatchUrl()

            if (isOnEpisodesListGoGoAnime[mediaId] == undefined) return fetchMediaWatchUrl()

            // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX
            episodedWatched = isOnEpisodesListGoGoAnime[mediaId].sort(
                function (a: { episodeTitle: number }, b: { episodeTitle: number }) {
                    return b.episodeTitle - a.episodeTitle
                }
            )

        }

        // CALL OTHER FUNCTION TO FETCH URL
        fetchMediaWatchUrl(episodedWatched[0].episodeTitle) // EPISODE TITLE HAS THE EPISODE NUMBER

    }

    async function fetchWithGoGoAnime() {

        const searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(mediaTitle), "anime").then((res) => {
            setSource("gogoanime")
            return res
        }) as MediaSearchResult[]

        const res = await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0].id, "anime") as MediaInfo || null

        return res.episodes.length == 0 ? null : res.episodes

    }

    async function fetchWithAniWatch() {

        const searchResultsForMedia = await aniwatch.searchMedia(stringToUrlFriendly(mediaTitle)).then(
            (res: void | MediaInfoFetchedAnimeWatch) => {
                setSource("aniwatch")
                return res!.animes
            }
        )

        const closestResult = searchResultsForMedia.find((item: any) => item.name.includes(stringToUrlFriendly(mediaTitle))) || searchResultsForMedia[0]

        const res = await aniwatch.getEpisodes(closestResult.id) as EpisodesFetchedAnimeWatch

        return res.episodes.length == 0 ? null : res.episodes
    }

    // if ANIME, get ID for the first episode of this media / if MOVIE, get movie ID  
    async function fetchMediaWatchUrl(lastEpisodeWatched?: number) {

        setIsLoading(true)

        // try first with animewatch
        let media: any = await fetchWithAniWatch()

        // if media is null, try with gogoanime
        if (!media) media = await fetchWithGoGoAnime()

        if (media && lastEpisodeWatched) {

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
            setMovieId(source == "gogoanime" ? media[0].id : media[0].episodeId)
        }

        setIsLoading(false)
    }

    // redirect to watch page
    function redirectTo() {

        router.push(`/watch/${mediaId}?source=${source}&episode=${episodeNumber}&q=${movieId}`)

    }

    useEffect(() => {

        (user && !loading) ? checkLastEpisodeWatched() : fetchMediaWatchUrl()

    }, [user, episodeNumber])

    return (
        <button
            role='link'
            onClick={() => redirectTo()}
            disabled={isLoading || movieId?.length == 0}
            title={isLoading ? "Wait the Loading" : `Watch ${mediaTitle} ${episodeNumber ? ` - EP ${episodeNumber}` : ""}`}
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