import { EpisodeLinks, MangaInfo, MangaPages, MangaSearchResult, MediaInfo, MediaSearchResult } from "@/app/ts/interfaces/apiGogoanimeDataInterface";
import Axios from "axios"

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // SEARCH ANIME AND MANGA BY QUERY
    searchMedia: async (query: string, type: string, page?: number) => {

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

        }

    },

    // GET ANIME AND MANGA INFO
    getInfoFromThisMedia: async (id: string | number, type: string) => {

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

        }

    },

    // GET EPISODES FOR ANIMES AND MOVIES
    getEpisodeStreamingLinks: async (episodeId: string | number, serverName?: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/anime/gogoanime/watch/${episodeId}${serverName ? `?server=${serverName}` : ""}`,
                method: 'GET'
            })

            return data;
        }
        catch (error) {

            console.log(error)

        }

    },

    // GET PAGES FOR MANGA CHAPTER
    getChapterPages: async (chapterId: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/manga/mangahere/read?chapterId=${chapterId}`,
                method: 'GET'
            })

            return data as MangaPages[];
        }
        catch (error) {

            return error

        }

    },

    // GET LINKS FOR THIS EPISODE
    getLinksForThisEpisode: async (episodeId: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/meta/anilist/watch/${episodeId}`,
                method: 'GET'
            })

            return data as EpisodeLinks[];
        }
        catch (error) {

            return error

        }

    }
}