import {
    EpisodeLinksGoGoAnime, MangaInfo,
    MangaPages, MangaSearchResult,
    MediaInfo, MediaSearchResult
} from "@/app/ts/interfaces/apiGogoanimeDataInterface";
import Axios from "axios"
import axiosRetry from "axios-retry";
import { cache } from "react";

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 2500,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber}`)
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // SEARCH ANIME AND MANGA BY QUERY
    searchMedia: cache(async (query: string, type: string, page?: number) => {

        const serverSelected = type == "anime" ? "gogoanime" : "mangahere"

        try {

            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/${type}/${serverSelected}/${query}${page ? `?page=${page} ` : ""}`,
                method: 'GET'
            })

            return data.results as MediaSearchResult[] | MangaSearchResult[];

        }
        catch (error) {

            console.log(error)

            return null

        }

    }),

    // GET ANIME AND MANGA INFO
    getInfoFromThisMedia: cache(async (id: string | number, type: string) => {

        const route = type == "anime" ? `gogoanime/info/${id}` : `mangahere/info?id=${id}`

        try {

            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/${type}/${route}`,
                method: 'GET'
            })

            return data as MediaInfo | MangaInfo;
        }
        catch (error) {

            console.log(error)

            return null

        }

    }),

    // GET EPISODES FOR ANIMES AND MOVIES
    getEpisodeStreamingLinks: cache(async (episodeId: string | number, serverName?: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/anime/gogoanime/watch/${episodeId}${serverName ? `?server=${serverName}` : ""}`,
                method: 'GET'
            })

            return data;
        }
        catch (error) {

            console.log(error)

            return null

        }

    }),

    // GET PAGES FOR MANGA CHAPTER
    getChapterPages: cache(async (chapterId: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/manga/mangahere/read?chapterId=${chapterId}`,
                method: 'GET'
            })

            return data as MangaPages[];
        }
        catch (error) {

            console.log(error)

            return null

        }

    }),

    // GET LINKS FOR THIS EPISODE
    getLinksForThisEpisode: cache(async (episodeId: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/meta/anilist/watch/${episodeId}`,
                method: 'GET'
            })

            return data as EpisodeLinksGoGoAnime;
        }
        catch (error) {

            console.log(error)

            return null

        }

    })
}