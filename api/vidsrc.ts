import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_VIDSRC_API_URL

export async function getVideoSrcLink(query: string) {

    try {

        const { data } = await axios.get(`${BASE_URL}/${query}`)

        return data

    }
    catch (error) {

        console.log(error)

        return null

    }

}