import regexOnlyAlphabetic from "@/app/lib/regexOnlyAlphabetic"
import { ImdbMediaInfo, ImdbSearchItem } from "@/app/ts/interfaces/apiImdbInterface"
import Axios from "axios"
import axiosRetry from "axios-retry"
import { cache } from "react"

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 2500,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber}`)
})

// GET INFO FOR THIS MEDIA
export const searchMedia = cache(async (mediaTitle: string) => {

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
export const getMediaInfo = cache(async (search: boolean, mediaId?: string, type?: "TV Series", seachTitle?: string, releaseYear?: number) => {

    try {

        let mediaSearchedId: number | null = null
        let mediaSearchedType: string | null = null

        if (search && seachTitle) {

            const searchResults: ImdbSearchItem[] = await searchMedia(regexOnlyAlphabetic(seachTitle)).then(res => res.results)

            const filteredRes = searchResults.find((item) => Number(item.releaseDate) == releaseYear)

            mediaSearchedId = filteredRes?.id || searchResults[0].id
            mediaSearchedType = filteredRes?.type || searchResults[0].type

        }

        const { data } = await Axios({
            url: `${CONSUMET_API_URL}/meta/tmdb/info/${mediaSearchedId || mediaId}?type=${mediaSearchedType || type}`,
            method: "GET"
        })

        // adds ID to be used by Vidsrc API
        data.vidsrcId = mediaSearchedId

        return data as ImdbMediaInfo

    }
    catch (err) {

        console.log(err)

        return null

    }

})
