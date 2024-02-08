import { lastHourOfTheDay } from '@/app/lib/format_date_unix'
import { ApiAiringMidiaResults, ApiDefaultResult, ApiTrendingMidiaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import Axios from 'axios'

const BASE_URL: String = 'https://graphql.anilist.co/'

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

// returns the current season when gets called
function getCurrentSeason() {

    const mm = new Date().getMonth()
    const dd = new Date().getDate()

    switch (mm) {
        case 0:
            return 'WINTER'
        case 1:
            return 'WINTER'
        case 2:
            if (dd > 20) {
                return 'SPRING'
            }
            else {
                return 'WINTER'
            }
        case 3:
            return 'SPRING'
        case 4:
            return 'SPRING'
        case 5:
            if (dd > 21) {
                return 'SUMMER'
            }
            else {
                return 'SPRING'
            }
        case 6:
            return 'SUMMER'
        case 7:
            return 'SUMMER'
        case 8:
            if (dd > 22) {
                return 'FALL'
            }
            else {
                return 'SUMMER'
            }
        case 9:
            return 'FALL'
        case 10:
            return 'FALL'
        case 11:
            if (dd > 21) {
                return 'WINTER'
            }
            else {
                return 'FALL'
            }
        default:
            return 'SUMMER'
    }
}

function defaultApiQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                $type: MediaType, 
                $format: MediaFormat, 
                $sort: [MediaSort], 
                $season: MediaSeason, 
                $seasonYear: Int, 
                $page: Int, 
                $perPage: Int, 
                $showAdultContent: Boolean
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                Page(page: $page, perPage: $perPage){
                    media (
                        season: $season, 
                        seasonYear: $seasonYear, 
                        sort: $sort, 
                        type: $type, 
                        format: $format, 
                        isAdult: $showAdultContent
                        ${otherMediasFields ? otherMediasFields : ''}
                    ){
                        title{
                                romaji
                                native
                            }
                            description(asHtml: true)
                            isAdult
                            status
                            relations{
                                nodes{
                                    id
                                            type
                                            format
                                            title{
                                                native
                                                romaji
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                        }
                                    }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: ROLE){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActors{
                                                id
                                                name{
                                                    first
                                                    middle
                                                    last
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                description
                                                age
                                            }
                                            media{
                                                title{
                                                    romaji
                                                    native
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    type
                                                    format
                                                    title{
                                                        romaji
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                            studios{
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                            streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                            }
                            averageScore
                            nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                            }
                            startDate{
                                        year
                                        month
                                        day
                            }
                            endDate{
                                        year
                                        month
                                        day
                            }
                            season
                            seasonYear
                            isAdult
                            id
                            coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                            }
                            bannerImage
                            type
                            format
                            genres
                            popularity
                            averageScore
                        }
                    }
                }
            `
}

function mediaAiringApiQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                $page: Int,
                $sort: [AiringSort],
                $perPage: Int
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                Page(page: $page, perPage: $perPage){
                    airingSchedules(sort: $sort ${otherMediasFields ? otherMediasFields : ''}) {
                            id
                            airingAt
                            timeUntilAiring
                            episode
                            mediaId
                            media {
                                id
                                idMal
                                isAdult
                                description
                                title {
                                    romaji,
                                    native
                                }id
                                coverImage{
                                    extraLarge
                                    large
                                    medium
                                    color
                                }
                                trailer{
                                    id
                                    site
                                    thumbnail
                                }
                                bannerImage
                                type
                                format
                                status
                                description
                                season
                                seasonYear
                                seasonInt
                                episodes
                                duration
                                chapters
                                volumes
                                countryOfOrigin
                                isLicensed
                                source
                                hashtag
                                updatedAt
                                bannerImage
                                genres
                                synonyms
                                averageScore
                                meanScore
                                popularity
                                isLocked
                                trending
                                favourites
                                isFavourite
                                isFavouriteBlocked
                                isAdult
                                siteUrl
                                autoCreateForumThread
                                isRecommendationBlocked
                                isReviewBlocked
                                modNotes
                            }
                        }
                    }
                }
            `
}

function mediaTrendingApiQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query Page (
                $page: Int,
                $sort: [MediaTrendSort],
                $perPage: Int
                ${otherQueryFields ? otherQueryFields : ''}) {
        Page (page: $page, perPage: $perPage){
            mediaTrends(sort: $sort ${otherMediasFields ? otherMediasFields : ''}) {
                mediaId
                date
                trending
                averageScore
                inProgress
                releasing
                episode
                popularity
                media {
                    id
                    idMal
                    isAdult
                    title {
                    romaji,
                     native
                    }id
                    coverImage{
                    extraLarge
                    large
                    medium
                    color
                    }
                    trailer{
                        id
                        site
                        thumbnail
                    }
                    bannerImage
                    type
                    format
                    status
                    description
                    season
                    seasonYear
                    seasonInt
                    episodes
                    duration
                    chapters
                    volumes
                    countryOfOrigin
                    isLicensed
                    source
                    hashtag
                    updatedAt
                    bannerImage
                    genres
                    synonyms
                    averageScore
                    meanScore
                    popularity
                    isLocked
                    trending
                    favourites
                    isFavourite
                    isFavouriteBlocked
                    isAdult
                    siteUrl
                    autoCreateForumThread
                    isRecommendationBlocked
                    isReviewBlocked
                    modNotes
                }
            }
        }
    }
    `
}

function mediaByIdQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                    Media (
                        ${otherMediasFields ? otherMediasFields : ''}
                    ){
                            title{
                                romaji
                                native
                            }
                            description(asHtml: true)
                            isAdult
                            status
                            relations{
                                nodes{
                                    id
                                            type
                                            format
                                            title{
                                                native
                                                romaji
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                    }
                                }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: ROLE){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActorRoles{
                                                voiceActor{
                                                    id
                                                    name{
                                                        first
                                                        middle
                                                        last
                                                        full
                                                        native
                                                        alternative
                                                    }
                                                    image{
                                                        large
                                                        medium
                                                    }
                                                    description
                                                    age
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    seasonYear
                                                    genres
                                                    type
                                                    format
                                                    title{
                                                        romaji
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                            studios{
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                            streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                            }
                            relations {
                                edges {
                                    id
                                    relationType
                                    isMainStudio
                                    characterRole
                                    characterName
                                    roleNotes
                                    dubGroup
                                    staffRole
                                    favouriteOrder
                                    node {
                                        id
                                        genres
                                        idMal
                                        type
                                        format
                                        status
                                        description
                                        season
                                        seasonYear
                                        seasonInt
                                        episodes
                                        duration
                                        chapters
                                        volumes
                                        countryOfOrigin
                                        isLicensed
                                        source
                                        hashtag
                                        updatedAt
                                        bannerImage
                                        genres
                                        synonyms
                                        averageScore
                                        meanScore
                                        popularity
                                        isLocked
                                        trending
                                        favourites
                                        isFavourite
                                        isFavouriteBlocked
                                        isAdult
                                        siteUrl
                                        autoCreateForumThread
                                        isRecommendationBlocked
                                        isReviewBlocked
                                        modNotes
                                    }
                                }
                                nodes {
                                    id
                                    idMal
                                    type
                                    genres
                                    format
                                    status
                                    description
                                    season
                                    seasonYear
                                    seasonInt
                                    episodes
                                    duration
                                    chapters
                                    volumes
                                    countryOfOrigin
                                    isLicensed
                                    source
                                    hashtag
                                    updatedAt
                                    bannerImage
                                    genres
                                    synonyms
                                    averageScore
                                    meanScore
                                    popularity
                                    isLocked
                                    trending
                                    favourites
                                    isFavourite
                                    isFavouriteBlocked
                                    isAdult
                                    siteUrl
                                    autoCreateForumThread
                                    isRecommendationBlocked
                                    isReviewBlocked
                                    modNotes
                                }
                            }
                            averageScore
                            nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                }
                                startDate{
                                        year
                                        month
                                        day
                                }
                                endDate{
                                        year
                                        month
                                        day
                                }
                            season
                            seasonYear
                            isAdult
                            id
                            coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                            }
                            bannerImage
                            type
                            format
                            genres
                            popularity
                            averageScore
                        }
                }
                
            `
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // HOME PAGE
    getNewReleases: async (type: string, format?: string) => {

        const season: string = getCurrentSeason()

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'type': `${type}`,
                    'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                    'page': 1,
                    'sort': 'POPULARITY_DESC',
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
    },

    //SEARCH
    getSeachResults: async (query: string) => {

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
    },

    // RELEASING THIS WEEK
    getReleasingThisWeek: async (type: string, format?: string, page?: number) => {

        try {

            const thisYear = new Date().getFullYear()

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'page': 1,
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

    },

    // RELEASING BY DAYS RANGE
    getReleasingByDaysRange: async (type: string, timestamp: number, pageNumber?: number) => {

        try {

            const graphqlQuery = {
                "query": mediaAiringApiQueryRequest(
                    `, $airingAt_greater: Int, $airingAt_lesser: Int, $episode_in: [Int]`,
                    `, airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser, episode_in: $episode_in`
                ),
                "variables": {
                    'page': pageNumber || 1,
                    'perPage': 8,
                    'type': type,
                    'sort': 'TIME',
                    "episode_in": 1,
                    'showAdultContent': false,
                    'airingAt_greater': timestamp,
                    'airingAt_lesser': lastHourOfTheDay(1)
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

    },

    // TRENDING
    getTrendingMedia: async (sort?: string) => {

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

    },

    // MEDIAS IN THIS FORMAT    
    getMediaForThisFormat: async (type: string, sort?: string) => {

        try {

            const graphqlQuery = {
                "query": defaultApiQueryRequest(),
                "variables": {
                    'page': 1,
                    'sort': sort || 'TRENDING_DESC',
                    'perPage': 20,
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

    },

    // GET INFO OF anime/movie/manga by ID
    getMediaInfo: async (id: number) => {

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
    },

    // -------------------------------------------------------------------
    // TO REDO BELOW FUNCTIONS
    // -------------------------------------------------------------------
    getTopRated: async (type: String, format?: String, page?: Number) => {

        try {

            //gets all user info so the request will tell if must be shown adult content
            const userInfo = localStorage.getItem('userInfo') ?
                JSON.parse(localStorage.getItem('userInfo') || `{}`) : null


            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $perPage: Int, $page: Int ${userInfo?.showAdultContent ? '' : ', $showAdultContent: Boolean'}){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, sort: SCORE_DESC ${userInfo?.showAdultContent ? '' : ', isAdult: $showAdultContent '}){
                                    title{
                                        romaji
                                        native
                                    }
                                    status
                                    episodes
                                    averageScore
                                    startDate{
                                        year
                                    }
                                    isAdult
                                    id
                                    trailer{
                                        thumbnail
                                    }
                                    bannerImage
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    type
                                    format
                                    genres
                                    trending
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'type': `${type}`,
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': page ? page : 1,
                        'perPage': 3,
                        //if TRUE, it will NOT be used on the query. if FALSE, it WILL be used.
                        'showAdultContent': userInfo?.showAdultContent ? userInfo.showAdultContent : false
                    }
                })
            })

            // console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }

    },

    //Genre Page
    // anime
    getAnimesForThisGenre: async (tag: any, page?: Number) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($page: Int, $perPage: Int, $tag: String, $type: MediaType){
                            Page(page: $page, perPage: $perPage){
                                media(tag: $tag, sort: TRENDING_DESC, type: $type){
                                    title{
                                        romaji
                                        native
                                    }
                                    description(asHtml: false)
                                    status
                                    relations{
                                        nodes{
                                            id
                                            type
                                            format
                                            title{
                                                native
                                                romaji
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                        }
                                    }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: ROLE){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActors{
                                                id
                                                name{
                                                    first
                                                    middle
                                                    last
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                description
                                                age
                                            }
                                            media{
                                                title{
                                                    romaji
                                                    native
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    type
                                                    format
                                                    title{
                                                        romaji
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    studios{
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                                    streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                                    }
                                    averageScore
                                    nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                    }
                                    startDate{
                                        year
                                        month
                                        day
                                    }
                                    endDate{
                                        year
                                        month
                                        day
                                    }
                                    season
                                    seasonYear
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    bannerImage
                                    type
                                    format
                                    genres
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'page': page ? page : 1,
                        'perPage': 5,
                        'tag': `${tag}`,
                        'type': 'ANIME'
                    }
                })
            })

            return data.data.Page.media;
        }
        catch (error) {

            return console.log(error)
        }

    },

    //manga
    getMangasForThisGenre: async (tag: any, page?: Number) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($page: Int, $perPage: Int, $tag: String, $type: MediaType){
                            Page(page: $page, perPage: $perPage){
                                media(tag: $tag, sort: TRENDING_DESC, type: $type){
                                    title{
                                        romaji
                                        native
                                    }
                                    description(asHtml: false)
                                    status
                                    relations{
                                        nodes{
                                            id
                                            type
                                            format
                                            title{
                                                native
                                                romaji
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                        }
                                    }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: ROLE){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActors{
                                                id
                                                name{
                                                    first
                                                    middle
                                                    last
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                description
                                                age
                                            }
                                            media{
                                                title{
                                                    romaji
                                                    native
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    type
                                                    format
                                                    title{
                                                        romaji
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    studios{
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                                    streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                                    }
                                    averageScore
                                    nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                    }
                                    startDate{
                                        year
                                        month
                                        day
                                    }
                                    endDate{
                                        year
                                        month
                                        day
                                    }
                                    season
                                    seasonYear
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    bannerImage
                                    type
                                    format
                                    genres
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'page': page ? page : 1,
                        'perPage': 5,
                        'tag': `${tag}`,
                        'type': 'MANGA'
                    }
                })
            })

            return data.data.Page.media;
        }
        catch (error) {

            return console.log(error)
        }


    },


}
