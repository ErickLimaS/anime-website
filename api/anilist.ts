import { convertToUnix, lastHourOfTheDay } from '@/app/lib/formatDateUnix'
import { ApiAiringMidiaResults, ApiDefaultResult, ApiTrendingMidiaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Axios from 'axios'
import {
    defaultApiQueryRequest, getCurrentSeason,
    mediaAiringApiQueryRequest, mediaByIdQueryRequest,
    mediaTrendingApiQueryRequest
} from './anilistQueryFunctions'
import { cache } from 'react'

const BASE_URL: string = 'https://graphql.anilist.co/'

const headers = {
    'Content-Type': 'application/json',
}

// returns medias which is adult
function filterAdultContent(data: any[], reponseType?: "mediaByFormat") {

    let filtered

    if (reponseType == "mediaByFormat") {
        filtered = data.filter((item) => item.isAdult == false)
    }
    else {
        filtered = data.filter((item) => item.media.isAdult == false)
    }

    return filtered

}

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // HOME PAGE
    getNewReleases: cache(async (
        type: string,
        format?: string,
        sort?: string,
        showAdultContent?: boolean,
        status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS",
        page?: number,
        perPage?: number
    ) => {

        const season: string = getCurrentSeason()

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
    getSeachResults: cache(async (query: string, showAdultContent?: boolean) => {

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
                data.data.Page.media as ApiDefaultResult[] : filterAdultContent(data.data.Page.media, "mediaByFormat")

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }
    }),

    // RELEASING THIS WEEK
    getReleasingThisWeek: cache(async (type: string, format?: string, page?: number, showAdultContent?: boolean) => {

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
    getReleasingByDaysRange: cache(async (type: string, days: 1 | 7 | 30, pageNumber?: number, perPage?: number, showAdultContent?: boolean) => {

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
                    'sort': "EPISODE",
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
                data.data.Page.airingSchedules as ApiAiringMidiaResults[] : filterAdultContent(data.data.Page.airingSchedules) as ApiAiringMidiaResults[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }

    }),

    // TRENDING
    getTrendingMedia: cache(async (sort?: string, showAdultContent?: boolean) => {

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

    // MEDIAS IN THIS FORMAT    
    getMediaForThisFormat: cache(async (type: string, sort?: string, pageNumber?: number, perPage?: number, showAdultContent?: boolean) => {

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
                data.data.Page.media as ApiDefaultResult[] : filterAdultContent(data.data.Page.media, "mediaByFormat") as ApiDefaultResult[]

        }
        catch (error: any) {

            console.log(error.response.data)

            return null

        }

    }),

    // GET INFO OF anime/movie/manga by ID
    getMediaInfo: cache(async (id: number, showAdultContent?: boolean) => {

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
