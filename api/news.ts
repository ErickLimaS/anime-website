import { News } from "@/app/ts/interfaces/newsInterface"
import Axios from "axios"
import { cache } from "react"

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // GET ALL NEWS, OR NEWS BY TOPIC
    getNews: cache(async (topic?: string) => {

        try {

            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/news/ann/recent-feeds${topic ? `?topic=${topic}` : ""}`,
                method: "GET"
            })

            return data as News[]

        }
        catch (err) {

            console.log(err)

        }

    }),

    // GET NEWS ARTICLE BY ID
    getNewsInfo: cache(async (id: string) => {

        try {

            const { data } = await Axios({
                url: `${CONSUMET_API_URL}/news/ann/info?id=${id}`,
                method: "GET"
            })

            return data as News

        }
        catch (err) {

            console.log(err)

        }

    })

}