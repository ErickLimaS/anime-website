import stringToOnlyAlphabetic from "@/app/lib/convertStrings"
import { ImdbMediaInfo, ImdbSearchItem } from "@/app/ts/interfaces/apiImdbInterface"
import Axios from "axios"
import axiosRetry from "axios-retry"
import { cache } from "react"

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// HANDLES SERVER ERRORS, most of time when server was not running due to Free Tier usage
axiosRetry(Axios, {
    retries: 1,
    retryDelay: (retryAttempt) => retryAttempt * 1000,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`)
})

// SEARCH BY MEDIA TITLE
export const searchMedia = cache(async ({ mediaTitle }: { mediaTitle: string }) => {

    try {

        const { data } = await Axios({
            url: `${CONSUMET_API_URL}/meta/tmdb/${mediaTitle}`,
            method: "GET"
        })

        return data

    }
    catch (err) {

        console.log(err)

        return null
    }

})

// GET INFO FOR THIS MEDIA
export const getMediaInfo = cache(async ({ search, mediaId, type, seachTitle, releaseYear }: {
    search: boolean,
    mediaId?: string,
    type?: "TV Series",
    seachTitle?: string,
    releaseYear?: number
}) => {

    try {

        let mediaSearchedId: number | null = null
        let mediaSearchedType: string | null = null

        if (search && seachTitle) {

            const searchResults: ImdbSearchItem[] = await searchMedia({ mediaTitle: stringToOnlyAlphabetic(seachTitle) }).then(res => res.results)

            const filteredRes = searchResults.find((item) => Number(item.releaseDate) == releaseYear)

            mediaSearchedId = filteredRes?.id || searchResults[0].id
            mediaSearchedType = filteredRes?.type || searchResults[0].type

        }

        const { data } = await Axios({
            url: `${CONSUMET_API_URL}/meta/tmdb/info/${mediaSearchedId || mediaId}?type=${mediaSearchedType || type}`,
            method: "GET"
        })

        return data as ImdbMediaInfo

    }
    catch (err) {

        console.log(err)

        return null

    }

})
