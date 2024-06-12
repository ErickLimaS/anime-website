import { EpisodeLinksAnimeWatch, EpisodesFetchedAnimeWatch, MediaInfoFetchedAnimeWatch } from "@/app/ts/interfaces/apiAnimewatchInterface";
import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_ANIWATCH_API_URL

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 1300,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`)
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // SEARCH MEDIA
    searchMedia: cache(async ({ query, page }: { query: string, page?: number }) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/anime/search?q=${query}${page ? `&page=${page}` : ""}`,
            })

            return data as MediaInfoFetchedAnimeWatch

        }
        catch (error: any) {

            console.log(error?.response.data.errors)

            return null

        }
    }),

    // GET EPISODES, NO LINKS INCLUDED
    getEpisodes: cache(async ({ episodeId }: { episodeId: string }) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/anime/episodes/${episodeId}`,
            })

            return data as EpisodesFetchedAnimeWatch

        }
        catch (error: any) {

            console.log(error?.response.data.errors)

            return null

        }
    }),

    // GET EPISODES, NO LINKS INCLUDED
    episodesLinks: cache(async ({ episodeId, server, category }: { episodeId: string, server?: string, category?: "dub" | "sub" }) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/anime/episode-srcs?id=${episodeId}${server ? `&server=${server}` : ""}${category ? `&category=${category}` : ""}`,
            })

            return data as EpisodeLinksAnimeWatch

        }
        catch (error: any) {

            console.log(error?.response.data.errors)

            return null

        }
    })

}