import { EpisodeLinksAnimeWatch, EpisodesFetchedAnimeWatch, MediaInfoFetchedAnimeWatch } from "@/app/ts/interfaces/apiAnimewatchInterface";
import Axios from "axios";
import { cache } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_ANIWATCH_API_URL

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // SEARCH MEDIA
    searchMedia: cache(async (query: string, page?: number) => {

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
    getEpisodes: cache(async (mediaId: string) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/anime/episodes/${mediaId}`,
            })

            return data as EpisodesFetchedAnimeWatch

        }
        catch (error: any) {

            console.log(error?.response.data.errors)

            return null

        }
    }),

    // GET EPISODES, NO LINKS INCLUDED
    episodesLinks: cache(async (mediaId: string, server?: string, category?: string) => {

        try {

            const { data } = await Axios({
                url: `${BASE_URL}/anime/episode-srcs?id=${mediaId}${server ? `&server=${server}` : ""}${category ? `&category=${category}` : ""}`,
            })

            return data as EpisodeLinksAnimeWatch

        }
        catch (error: any) {

            console.log(error?.response.data.errors)

            return null

        }
    }),


}