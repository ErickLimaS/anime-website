"use client"
import React, { useEffect, useState } from 'react'
import PlaySvg from "@/public/assets/play2.svg"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import gogoanime from '@/api/gogoanime'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'
import { MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import { useRouter } from 'next/navigation'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/firebase/firebaseApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import { DocumentData, DocumentSnapshot, doc, getDoc, getFirestore } from 'firebase/firestore'

function PlayBtn({ mediaId, mediaTitle }: { mediaId: number, mediaTitle: string }) {

    const [movieId, setMovieId] = useState<string>("")
    const [episodeNumber, setEpisodeNumber] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    // CHECK LAST EPISODE WATCHED BY DESCRECENT ORDER 
    async function checkLastEpisodeWatched() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return fetchMediaWatchUrl()

        const isOnEpisodesList = userDoc.get("episodesWatchedBySource")?.gogoanime

        if (!isOnEpisodesList) return fetchMediaWatchUrl()

        if (isOnEpisodesList[mediaId] == undefined) return fetchMediaWatchUrl()

        // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX 
        const episodedWatched = isOnEpisodesList[mediaId].sort(
            function (a: { episodeTitle: number }, b: { episodeTitle: number }) {
                return b.episodeTitle - a.episodeTitle
            }
        )

        // CALL OTHER FUNCTION TO FETCH URL
        fetchMediaWatchUrl(episodedWatched[0].episodeTitle) // EPISODE TITLE HAS THE EPISODE NUMBER

    }

    // if ANIME, get ID for the first episode of this media / if MOVIE, get movie ID  
    async function fetchMediaWatchUrl(lastEpisodeWatched?: number) {

        setIsLoading(true)

        let media: MediaInfo | null = await gogoanime.getInfoFromThisMedia(stringToUrlFriendly(mediaTitle), "anime") as MediaInfo

        // if the name dont match any results, it will search for the query on the api, than make a new request by the ID of the first result 
        if (media == null) {
            const searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(mediaTitle), "anime") as MediaSearchResult[]

            media = (searchResultsForMedia.length > 0) ? await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0].id, "anime") as MediaInfo : null
        }

        if (media && lastEpisodeWatched) {

            const episodeSelected = media.episodes.find((item) => item.number == lastEpisodeWatched + 1) // add 1 to get the next episode after the last watched

            if (episodeSelected) {

                setMovieId(episodeSelected!.id)

                setEpisodeNumber(lastEpisodeWatched + 1) // add 1 to get the next episode after the last watched

                setIsLoading(false)

                return

            }
        }

        if (media?.episodes) {
            setMovieId(media.episodes[0].id)
        }

        setIsLoading(false)
    }

    // redirect to watch page
    function redirectTo() {

        router.push(`/watch/${mediaId}?q=${movieId}`)

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