import { convertToUnix, lastHourOfTheDay } from '@/app/lib/formatDateUnix'
import { ApiAiringMidiaResults, ApiDefaultResult, ApiTrendingMidiaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Axios from 'axios'
import {
    defaultApiQueryRequest, getCurrentSeason,
    mediaAiringApiQueryRequest, mediaByIdQueryRequest,
    mediaTrendingApiQueryRequest
} from './anilistQueryConstants'
import { cache } from 'react'
import axiosRetry from 'axios-retry'

const BASE_URL = 'https://graphql.anilist.co/'

const headers = {
    'Content-Type': 'application/json',
}

// returns medias with adult content
function filterMediasWithAdultContent(mediasList: ApiDefaultResult[] | ApiAiringMidiaResults[], reponseType?: "mediaByFormat") {

    if (reponseType == "mediaByFormat") {
        const mediasFiltered = (mediasList as ApiDefaultResult[]).filter((item) => item.isAdult == false)

        return mediasFiltered
    }
    else {
        const mediasFiltered = (mediasList as ApiAiringMidiaResults[]).filter((item) => item.media.isAdult == false)

        return mediasFiltered
    }

}

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 2000,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`)
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // HOME PAGE
    getNewReleases: cache(async ({ type, format, sort, showAdultContent, status, page, perPage }: {
        type: string,
        format?: string,
        sort?: string,
        showAdultContent?: boolean,
        status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS",
        page?: number,
        perPage?: number
    }) => {

        const season = getCurrentSeason()

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(status ? ", $status: MediaStatus" : undefined, status ? ', status: $status' : undefined),
                "variables": {
                    'type': `${type}`,
                    'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                    'page': page || 1,
                    'sort': sort || 'POPULARITY_DESC',
                    'perPage': perPage || 20,
                    'season': status ? undefined : `${season}`,
                    'status': status ? status : undefined,
                    'seasonYear': `${new Date().getFullYear()}`,
                    'showAdultContent': showAdultContent || false
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return data.data.Page.media as ApiDefaultResult[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }
    }),

    //SEARCH
    getSeachResults: cache(async ({ query, showAdultContent }: { query: string, showAdultContent?: boolean }) => {

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(', $search: String', ', search: $search'),
                "variables": {
                    'page': 1,
                    'sort': 'TRENDING_DESC',
                    'perPage': 15,
                    'showAdultContent': showAdultContent == true ? undefined : false,
                    'search': query
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return showAdultContent ?
                data.data.Page.media as ApiDefaultResult[] : filterMediasWithAdultContent(data.data.Page.media, "mediaByFormat")

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }
    }),

    // RELEASING THIS WEEK
    getReleasingThisWeek: cache(async ({ type, format, page, showAdultContent }: { type: string, format?: string, page?: number, showAdultContent?: boolean }) => {

        try {

            const thisYear = new Date().getFullYear()

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'type': type || "ANIME",
                    'page': page || 1,
                    'sort': 'TRENDING_DESC',
                    'perPage': 10,
                    'showAdultContent': showAdultContent || false,
                    'season': getCurrentSeason(),
                    'year': thisYear
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return data.data.Page.media as ApiDefaultResult[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }

    }),

    // RELEASING BY DAYS RANGE
    getReleasingByDaysRange: cache(async ({ type, days, pageNumber, perPage, showAdultContent }: {
        type: string,
        days: 1 | 7 | 30,
        pageNumber?: number,
        perPage?: number,
        showAdultContent?: boolean
    }) => {

        try {

            const dateInUnix = convertToUnix(days)

            const graphqlQuery = {
                "query": mediaAiringApiQueryRequest(
                    `, $airingAt_greater: Int, $airingAt_lesser: Int`,
                    `, airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser`
                ),
                "variables": {
                    'page': pageNumber || 1,
                    'perPage': perPage || 5,
                    'type': type,
                    'sort': "TIME_DESC",
                    'showAdultContent': showAdultContent == true ? undefined : false,
                    'airingAt_greater': dateInUnix,
                    'airingAt_lesser': lastHourOfTheDay(1) // returns today last hour 
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return showAdultContent ?
                data.data.Page.airingSchedules as ApiAiringMidiaResults[] : filterMediasWithAdultContent(data.data.Page.airingSchedules) as ApiAiringMidiaResults[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }

    }),

    // TRENDING
    getTrendingMedia: cache(async ({ sort, showAdultContent }: { sort?: string, showAdultContent?: boolean }) => {

        try {

            const thisYear = new Date().getFullYear()

            const graphqlQuery = {
                "query": mediaTrendingApiQueryRequest(),
                "variables": {
                    'page': 1,
                    'sort': sort || 'TRENDING_DESC',
                    'perPage': 20,
                    'showAdultContent': showAdultContent == true ? undefined : false,
                    'season': getCurrentSeason(),
                    'year': thisYear
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return data.data.Page.mediaTrends as ApiTrendingMidiaResults[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }

    }),

    // MEDIAS WITH INDICATED FORMAT    
    getMediaForThisFormat: cache(async ({ type, sort, pageNumber, perPage, showAdultContent }: {
        type: string,
        sort?: string,
        pageNumber?: number,
        perPage?: number,
        showAdultContent?: boolean
    }) => {

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'page': pageNumber || 1,
                    'sort': sort || 'TRENDING_DESC',
                    'perPage': perPage || 20,
                    'showAdultContent': showAdultContent == true ? undefined : false,
                    'type': type
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return showAdultContent ?
                data.data.Page.media as ApiDefaultResult[] : filterMediasWithAdultContent(data.data.Page.media, "mediaByFormat") as ApiDefaultResult[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }

    }),

    // GET MEDIA INFO BY ID
    getMediaInfo: cache(async ({ id, showAdultContent }: { id: number, showAdultContent?: boolean }) => {

        try {

            const graphqlQuery = {
                "query": mediaByIdQueryRequest('$id: Int', 'id: $id'),
                "variables": {
                    'id': id
                }
            }

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: headers,
                data: graphqlQuery
            })

            return data.data.Media as ApiDefaultResult

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }
    }),

}
