import Axios from 'axios'

const BASE_URL: String = 'https://graphql.anilist.co/'

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    getNewReleases: async (type: String, format?: String) => {

        const seasonYear = new Date().getFullYear() - 3
        let season;

        switch (new Date().getMonth()) {
            case 0:
                season = 'WINTER'
                break;
            case 1:
                season = 'WINTER'
                break;
            case 2:
                season = 'SPRING'
                break;
            case 3:
                season = 'SPRING'
                break;
            case 4:
                season = 'SPRING'
                break;
            case 5:
                season = 'SUMMER'
                break;
            case 6:
                season = 'SUMMER'
                break;
            case 7:
                season = 'SUMMER'
                break;
            case 8:
                season = 'AUTUMN'
                break;
            case 9:
                season = 'AUTUMN'
                break;
            case 10:
                season = 'AUTUMN'
                break;
            case 11:
                season = 'WINTER'
                break;
            default: // exception/error
                season = 'SUMMER'
                break;
        }

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    query: `query($type: MediaType, $format: MediaFormat, $season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
                        Page(page: $page, perPage: $perPage){
                            media (season: $season, seasonYear: $seasonYear, type: $type, format: $format, isAdult: false){
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
                        'perPage': 1,
                        // 'perPage': 5,
                        'season': `${season}`,
                        'seasonYear': `${seasonYear}`
                    }

                })

            })

            console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }
    },

    getReleasingThisWeek: async (type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $format: MediaFormat, $perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(status: RELEASING, type: $type, format: $format, isAdult: false, sort: UPDATED_AT_DESC){
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
                        'type': `${type}`,
                        'format': `${(format === 'MOVIE' && 'MOVIE') || (type === 'MANGA' && 'MANGA') || (type === 'ANIME' && 'TV')}`,
                        'page': 1,
                        'perPage': 4,
                        'year': new Date().getFullYear(),
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

    getTrending: async (type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, isAdult: false, sort: TRENDING_DESC){
                                    title{
                                        romaji
                                        native
                                    }
                                    
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
                        'perPage': 3,
                        'year': new Date().getFullYear(),
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

    getTopRated: async (type: String, format?: String) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($type: MediaType, $perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(type: $type, isAdult: false, sort: SCORE_DESC){
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
                        'page': 1,
                        'perPage': 3,
                    }
                })
            })

            // console.log(data.data.Page.media)

            return data.data.Page.media

        }
        catch (error) {

            return console.log(error)

        }

    }
}
