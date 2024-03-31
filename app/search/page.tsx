import React from 'react'
import styles from './page.module.css'
import NavSideBar from './components/NavSideBar'
import ResultsContainer from './components/ResultsContainer'
import { Metadata } from 'next'
import axios from 'axios'

export const metadata: Metadata = {
    title: 'Search | AniProject',
    description: 'Filter animes released on that year, or just discover a new one in a genre you didnt watched yet.',
}

async function SearchPage({ searchParams }: {
    searchParams: {
        type?: string,
        title?: string,
        genre?: string[],
        year?: number,
        status?: string,
        page?: string,
        sort?: string,
        season?: string,
    }
}) {

    const sort = await axios.get(`${process.env.NEXT_PUBLIC_INSIDE_API_URL}?${Object.entries(searchParams).map(e => e.join('=')).join('&')}`).then(res => res.data)

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

                <NavSideBar />

            </div>

            <ResultsContainer data={sort.data} lastUpdate={sort.lastUpdate} totalLength={sort.allResultsLength} />

        </main>
    )

}

export default SearchPage