import React from 'react'
import AnimeDataOffline from "@/api/anime-offline-database.json"
import styles from './page.module.css'
import NavSideBar from './components/NavSideBar'
import ResultsContainer from './components/ResultsContainer'
import { headers } from 'next/headers'
import { checkDeviceIsMobile } from '../lib/checkMobileOrDesktop'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Search | AniProject',
    description: 'Search for animes released on that year, or just discover a new one in a genre you didnt watched yet.',
}

async function SearchPage({ searchParams }: {
    searchParams: {
        type?: string, title?: string, genre?: string[], year?: number, status?: string
    }
}) {

    const isMobile = checkDeviceIsMobile(headers())

    let sort = (AnimeDataOffline as any).data

    if (searchParams.type) sort = sort.filter((item: { type: string }) => item.type == searchParams.type!.toUpperCase())

    if (searchParams.genre) sort = sort.filter((item: { tags: string[] }) => item.tags.some(a => searchParams.genre!.includes(a)))

    if (searchParams.status) sort = sort.filter((item: { status: string }) => item.status == searchParams.status!.toUpperCase())

    if (searchParams.year) sort = sort.filter((item: { animeSeason: { year: number } }) => item.animeSeason.year == searchParams.year)

    if (searchParams.title) sort = sort.filter((item: { title: string }) => item.title.toLowerCase().includes(searchParams.title!.toLowerCase()))

    // GET ANILIST ID FOR THIS MEDIA
    if (sort) {
        sort.map((item: { sources: string[]; anilistId: string }) => item.sources.map(a => {
            const foundUrl: string | null = a.includes("https://anilist.co/anime") ? a.slice(a.search(/\banime\b/)) : null

            if (foundUrl) item.anilistId = foundUrl!.slice(6)

        }))
    }

    return (
        <main id={styles.container}>

            <div id={styles.side_nav}>

                <NavSideBar isMobile={isMobile} />

            </div>

            <ResultsContainer data={sort} />

        </main>
    )

}

export default SearchPage