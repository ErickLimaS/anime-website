"use client"
import React, { useEffect, useState } from 'react'
import PlaySvg from "@/public/assets/play2.svg"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import gogoanime from '@/api/gogoanime'
import { stringToUrlFriendly } from '@/app/lib/convertStringToUrlFriendly'
import { MediaInfo, MediaSearchResult } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import { useRouter } from 'next/navigation'

function PlayBtn({ mediaId, mediaTitle }: { mediaId: number, mediaTitle: string }) {

    const [movieId, setMovieId] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const router = useRouter()

    function redirectTo() {

        router.push(`/watch/${mediaId}?q=${movieId}`)

    }

    async function fetchMediaWatchUrl() {

        setIsLoading(true)

        let media: MediaInfo | null = await gogoanime.getInfoFromThisMedia(stringToUrlFriendly(mediaTitle), "anime") as MediaInfo

        // if the name dont match any results, it will search for the query on the api, than make a new request by the ID of the first result 
        if (media == null) {
            const searchResultsForMedia = await gogoanime.searchMedia(stringToUrlFriendly(mediaTitle), "anime") as MediaSearchResult[]

            media = (searchResultsForMedia.length > 0) ? await gogoanime.getInfoFromThisMedia(searchResultsForMedia[0].id, "anime") as MediaInfo : null
        }

        if (media?.episodes) {

            setMovieId(media.episodes[0].id)
            setIsLoading(false)
        }
        else {
            setIsLoading(false)
        }

    }

    useEffect(() => {
        fetchMediaWatchUrl()
    }, [])

    return (
        <button
            role='link'
            onClick={() => redirectTo()}
            disabled={isLoading || movieId?.length == 0}
            title={isLoading ? "Wait the Loading" : `Watch ${mediaTitle}`}
        >
            {isLoading ?
                <LoadingSvg width={16} height={16} /> :
                <PlaySvg fill="#fff" width={16} height={16} />
            }
        </button>
    )
}

export default PlayBtn