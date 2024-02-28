import React from 'react'
import styles from './page.module.css'
import NavSideBar from './components/NavSideBar'
import ResultsContainer from './components/ResultsContainer'
import { headers } from 'next/headers'
import { checkDeviceIsMobile } from '../lib/checkMobileOrDesktop'
import { Metadata } from 'next'
import axios from 'axios'

export const metadata: Metadata = {
    title: 'Search | AniProject',
    description: 'Search for animes released on that year, or just discover a new one in a genre you didnt watched yet.',
}

async function SearchPage({ searchParams }: {
    searchParams: {
        type?: string,
        title?: string,
        genre?: string[],
        year?: number,
        status?: string,
        page?: string
    }
}) {

    const isMobile = checkDeviceIsMobile(headers())

    // UGLY CODE! I WILL TRY TO FIX IT LATER!
    // APPEND POSSIBLES QUERYS TO THIS VARIABLE
    const query = (searchParams ?
        `?
        ${searchParams.type ? `type=${searchParams.type}` : ""}${searchParams.title ? "&" : ""}
        ${searchParams.title ? `title=${searchParams.title}` : ""}${searchParams.genre ? "&" : ""}
        ${searchParams.genre ? `genre=${searchParams.genre}` : ""}${searchParams.year ? "&" : ""}
        ${searchParams.year ? `year=${searchParams.year}` : ""}${searchParams.status ? "&" : ""}
        ${searchParams.status ? `status=${searchParams.status}` : ""}${searchParams.page ? "&" : ""}
        ${searchParams.page ? `page=${searchParams.page}` : ""}`
        :
        "")
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/\s+/g, '')

    const sort: any = await axios.get(`${process.env.NEXT_PUBLIC_INSIDE_API_URL}${query ? query : ""}`).then(res => res.data)

    // GET ANILIST ID FOR THIS MEDIA
    if (sort.data) {
        sort.data.map((item: { sources: string[]; anilistId: string }) => item.sources.map(a => {
            const foundUrl: string | null = a.includes("https://anilist.co/anime") ? a.slice(a.search(/\banime\b/)) : null

            if (foundUrl) item.anilistId = foundUrl!.slice(6)

        }))
    }

    return (
        <main id={styles.container}>

            <div id={styles.side_nav}>

                <NavSideBar isMobile={isMobile} />

            </div>

            <ResultsContainer data={sort.data} totalLength={sort.allResultsLength} />

        </main>
    )

}

export default SearchPage