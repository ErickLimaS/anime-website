import axios from "axios"
import axiosRetry from "axios-retry"
import { cache } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_VIDSRC_API_URL

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryAttempt) => retryAttempt * 2500,
    retryCondition: (error) => error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber}`)
})

export const getVideoSrcLink = cache(async (query: string) => {

    try {

        const { data } = await axios.get(`${BASE_URL}/${query}`)

        return data

    }
    catch (error: any) {

        console.log(error.response.data)

        return null

    }

})