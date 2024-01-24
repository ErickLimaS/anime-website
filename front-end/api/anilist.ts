import Axios from 'axios'
import Swal from 'sweetalert2';

// TO BE REWRITED

const BASE_URL: String = 'https://graphql.anilist.co/'

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // HOME PAGE
    getNewReleases: async (type: String, format?: String) => {

        const mm = new Date().getMonth()
        const dd = new Date().getDate()
        const seasonYear = new Date().getFullYear()

        // self invoking function
        const season: string = (() => {
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
                default: // exception/error
                    return 'SUMMER'
            }
        })()

        try {

            //gets all user info so the request will tell if must be shown adult content
            const userInfo = localStorage.getItem('userInfo') ?
                JSON.parse(localStorage.getItem('userInfo') || `{}`) : null

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    query: `query($type: MediaType, $format: MediaFormat, $sort: [MediaSort], ${format !== 'MOVIE' ? '$status: MediaStatus, ' : ''} $season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int ${userInfo?.showAdultContent ? '' : ', $showAdultContent: Boolean'}) {
                        Page(page: $page, perPage: $perPage){
                            media (${format !== 'MOVIE' ? 'status: $status, ' : ''} season: $season, seasonYear: $seasonYear, sort: $sort, type: $type, format: $format ${userInfo?.showAdultContent ? '' : ', isAdult: $showAdultContent '}){
                                title{
                                    romaji
                                    native
                                }
                                startDate{
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
                        'page': 1,
                        'status': 'RELEASING',
                        'sort': 'TRENDING_DESC',
                        'perPage': 25,
                        'season': `${season}`,
                        'seasonYear': `${seasonYear}`,
                        //if TRUE, it will NOT be used on the query. if FALSE, it WILL be used.
                        'showAdultContent': userInfo?.showAdultContent ? userInfo.showAdultContent : false
                    }

                })

            })

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }
    },

    getReleasingThisWeek: async (type: String, format?: String, page?: Number) => {

        try {

            const yyyy = new Date().getFullYear()
            // const mm = new Date().getMonth() >= 0 && new Date().getMonth() <= 9 ?
            //     `0${new Date().getMonth()}` : `${new Date().getMonth()}`
            // const dd = '00'

            //gets all user info so the request will tell if must be shown adult content
            const userInfo = localStorage.getItem('userInfo') ?
                JSON.parse(localStorage.getItem('userInfo') || `{}`) : null

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query(
                            $type: MediaType, 
                            $format: MediaFormat, 
                            $sort: [MediaSort], $perPage: Int, 
                            $page: Int, 
                            ${(format !== 'MANGA' && type !== 'MANGA') ? `$season: MediaSeason,` : ''}
                            ${(format !== 'MANGA' && type !== 'MANGA') ? `$seasonYear: Int,` : ''}  
                            ${(format !== 'MOVIE') ? `$status: MediaStatus` : ''} 
                            ${userInfo?.showAdultContent ? '' : ', $showAdultContent: Boolean'}){
                            Page(
                                page: $page, 
                                perPage: $perPage
                            ){
                                media(
                                    ${(format !== 'MOVIE') ? `status: $status,` : ''}  
                                    type: $type, 
                                    ${(format !== 'MANGA' && type !== 'MANGA') ? `season: $season,` : ''}
                                    ${(format !== 'MANGA' && type !== 'MANGA') ? `seasonYear: $seasonYear,` : ''} 
                                    format: $format,
                                    sort: $sort ${userInfo?.showAdultContent ? '' : ', isAdult: $showAdultContent '}
                                    ){
                                    title{
                                        romaji
                                        native
                                    }
                                    nextAiringEpisode{
                                        airingAt
                                        episode
                                    }
                                    status
                                    episodes
                                    averageScore
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
                                    trending
                                    popularity
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'status': 'RELEASING',
                        'type': `${type}`,
                        'sort': (format === 'MOVIE' && 'ID_DESC') || (type === "MANGA" && "POPULARITY_DESC") || (['EPISODES_DESC', 'TRENDING_DESC']),
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': page ? page : 1,
                        'perPage': 4,
                        'season': 'FALL',
                        'seasonYear': yyyy,
                        // 'startDate_greater': `${yyyy}${mm}${dd}`,
                        //if TRUE, it will NOT be used on the query. if FALSE, it WILL be used.
                        'showAdultContent': userInfo?.showAdultContent ? userInfo.showAdultContent : false
                    }
                })
            })

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }

    },

    getTrending: async (type: String, format?: String, tag?: String) => {

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
                        query($type: MediaType, $perPage: Int, $page: Int ${userInfo?.showAdultContent ? '' : ', $showAdultContent: Boolean'} ${format && ', $format: MediaFormat,'}${tag && '$tag: String'}){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, sort: TRENDING_DESC ${format && ', format: $format'} ${tag && ', tag: $tag'} ${userInfo?.showAdultContent ? '' : ', isAdult: $showAdultContent '}){
                                    title{
                                        romaji
                                        native
                                    }
                                    description
                                    status
                                    episodes
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
                        'page': 1,
                        'perPage': 10,
                        'year': new Date().getFullYear(),
                        'tag': `${(tag ? `${tag}` : ``)}`,
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

    //SEARCH
    getSeachResults: async (searchThis: String, type?: String) => {

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
                        query($perPage: Int, $page: Int, $type: MediaType, $search: String${userInfo?.showAdultContent ? '' : ', $showAdultContent: Boolean'}){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, search: $search ${userInfo?.showAdultContent ? '' : ', isAdult: $showAdultContent '}){
                                    title{
                                        romaji
                                        native
                                    }
                                    episodes
                                    startDate{
                                        year
                                    }
                                    isAdult
                                    id
                                    coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                                    }
                                    type
                                    format
                                    genres
                                    averageScore
                                }
                            }
                        }
                    `,
                    variables: {
                        'type': `${type ? `${type}` : 'ANIME'}`,
                        'search': `${searchThis}`,
                        'page': 1,
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

            console.log(error)

        }
    },

    //ANIME, MOVIE, MANGA PAGE 

    //INFO OF CERTAIN anime/movie/manga ID
    getInfoFromThisMedia: async (id: number, type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $id: Int, $format: MediaFormat, $language: StaffLanguage){
                                Media(type: $type, format: $format, id: $id){
                                    title{
                                        romaji
                                        native
                                    }
                                    description(asHtml: true)
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
                                            voiceActors(language: $language){
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
                    `,
                    variables: {
                        'id': `${id}`,
                        'language': 'JAPANESE',
                        'type': `${type}`,
                        'format': `${format !== undefined ? `${format}` : (type === 'ANIME' && 'TV') || (type === 'MANGA' && 'MANGA')}`,
                    }
                })
            })

            return data.data.Media;
        }
        catch (error: any) {

            switch (error.response.status) {

                case 404:
                    return Swal.fire({

                        icon: 'error',
                        title: 'Error',
                        titleText: `404: Not Found!`,
                        text: 'It seems the API doesnt have any information about this media!',
                        allowOutsideClick: false,
                        confirmButtonText: 'Return To Home',
                        didClose: () => {
                            window.location.replace("/");
                        }

                    })

                default:
                    return Swal.fire({

                        icon: 'error',
                        title: 'Error',
                        titleText: `${error.response.status}: What Happened?`,
                        text: 'This is a standart error alert when we dont know what happened! Please, return to Home and try again later. ',
                        allowOutsideClick: false,
                        confirmButtonText: 'Return To Home',
                        didClose: () => {
                            window.location.replace("/");
                        }

                    })

            }

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

    //Format Page
    // anime
    getMediaForThisFormat: async (format: any, page?: Number) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($page: Int, $perPage: Int, $tag: String, $format: MediaFormat){
                            Page(page: $page, perPage: $perPage){
                                media(tag: $tag, sort: TRENDING_DESC, format: $format){
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
                        'format': `${format.toUpperCase()}`,
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

}
