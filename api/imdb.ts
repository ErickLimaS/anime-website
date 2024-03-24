import regexOnlyAlphabetic from "@/app/lib/regexOnlyAlphabetic"
import { ImdbMediaInfo, ImdbSearchItem } from "@/app/ts/interfaces/apiImdbInterface"
import Axios from "axios"
import { cache } from "react"

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// GET INFO FOR THIS MEDIA
export async function searchMedia(mediaTitle: string) {

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

}

// GET INFO FOR THIS MEDIA
export async function getMediaInfo(search: boolean, mediaId?: string, type?: "TV Series", seachTitle?: string, releaseYear?: number) {

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

        return data as ImdbMediaInfo

    }
    catch (err) {

        console.log(err)

        return null

    }

}
