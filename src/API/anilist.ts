import Axios from 'axios'

const BASE_URL: String = 'https://graphql.anilist.co/'

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    getNewReleases: async () => {

        let season = 'SUMMER' //fix to correspond month
        let seasonYear = new Date().getFullYear() - 2

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({

                    query: `query($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
                        Page(page: $page, perPage: $perPage){
                            media (season: $season, seasonYear: $seasonYear, type: ANIME, isAdult: false){
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
                        'page': 1,
                        'perPage': 1,
                        // 'perPage': 5,
                        'season': `${season}`,
                        'seasonYear': `${seasonYear}`
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

    getReleasingThisWeek: async () => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(status: RELEASING, type: ANIME, sort: TRENDING_DESC){
                                    title{
                                        romaji
                                        native
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
                    variables:{
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

    getTrending: async () => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    query: `
                        query($perPage: Int, $page: Int){
                            Page(page: $page, perPage: $perPage){
                                media(type: ANIME, sort: TRENDING_DESC){
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
                    variables:{
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

    }
}
