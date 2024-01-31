import { MediaInfo, MediaSearchResult } from "@/app/ts/interfaces/apiGogoanimeDataInterface";
import Axios from "axios"

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // SEARCH MEDIA BY QUERY
    searchMedia: async (query: string, type: string, page?: number) => {

        try {

            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/${type}/gogoanime/${query}${page ? `?page=${page} ` : ""}`,
                method: 'GET'
            })

            return data.results as MediaSearchResult[];

        }
        catch (error) {

            console.log(error)

        }

    },

    // GET MEDIA INFO 
    getInfoFromThisMedia: async (id: string | number, type: string) => {

        try {

            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/${type}/gogoanime/info/${id}`,
                method: 'GET'
            })

            return data as MediaInfo;
        }
        catch (error) {

            console.log(error)

        }

    },

    getEpisodeStreamingLinks: async (episodeId: string | number, type: string, serverName?: string) => {

        try {
            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/${type}/gogoanime/watch/${episodeId}${serverName ? `?server=${serverName}` : ""}`,
                method: 'GET'
            })

            return data;
        }
        catch (error) {

            console.log(error)

        }

    }
}