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

type ErrorTypes = {
    response: {
        data: {
            errors: unknown
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // HOME PAGE
    getNewReleases: cache(async (type: string, format?: string, sort?: string) => {

        const season: string = getCurrentSeason()

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'type': `${type}`,
                    'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                    'page': 1,
                    'sort': sort || 'POPULARITY_DESC',
                    'perPage': 20,
                    'season': `${season}`,
                    'seasonYear': `${new Date().getFullYear()}`,
                    'showAdultContent': false
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
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)

        }
    }),

    //SEARCH
    getSeachResults: cache(async (query: string) => {

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(', $search: String', ', search: $search'),
                "variables": {
                    'page': 1,
                    'sort': 'TRENDING_DESC',
                    'perPage': 10,
                    'showAdultContent': false,
                    'search': query
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
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)

        }
    }),

    // RELEASING THIS WEEK
    getReleasingThisWeek: cache(async (type: string, format?: string, page?: number) => {

        try {

            const thisYear = new Date().getFullYear()

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'type': type || "ANIME",
                    'page': page || 1,
                    'sort': 'TRENDING_DESC',
                    'perPage': 10,
                    'showAdultContent': false,
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
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)

        }

    }),

    // RELEASING BY DAYS RANGE
    getReleasingByDaysRange: cache(async (type: string, days: number, pageNumber?: number, perPage?: number) => {

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
                    'showAdultContent': false,
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

            return data.data.Page.airingSchedules as ApiAiringMidiaResults[]

        }
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)

        }

    }),

    // TRENDING
    getTrendingMedia: cache(async (sort?: string) => {

        try {

            const thisYear = new Date().getFullYear()

            const graphqlQuery = {
                "query": mediaTrendingApiQueryRequest(),
                "variables": {
                    'page': 1,
                    'sort': sort || 'TRENDING_DESC',
                    'perPage': 20,
                    'showAdultContent': false,
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
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)

        }

    }),

    // MEDIAS IN THIS FORMAT    
    getMediaForThisFormat: cache(async (type: string, sort?: string, pageNumber?: number, perPage?: number) => {

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'page': pageNumber || 1,
                    'sort': sort || 'TRENDING_DESC',
                    'perPage': perPage || 20,
                    'showAdultContent': false,
                    'type': type
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
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)
        }

    }),

    // GET INFO OF anime/movie/manga by ID
    getMediaInfo: cache(async (id: number) => {

        try {

            const graphqlQuery = {
                "query": mediaByIdQueryRequest('$id: Int', 'id: $id'),
                "variables": {
                    'id': id,
                    'showAdultContent': false
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
        catch (error) {

            return console.log((error as ErrorTypes).response.data.errors)

        }
    }),

}
