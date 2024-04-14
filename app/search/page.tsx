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

    const isMobile = checkDeviceIsMobile(headers())

    const sort = await axios.get(`${process.env.NEXT_PUBLIC_NEXT_INTERNAL_API_URL}?${Object.entries(searchParams).map(e => e.join('=')).join('&')}`).then(res => res.data)

    return (
        <main id={styles.container}>

            <div id={styles.side_nav}>

                <NavSideBar isMobile={isMobile || false} />

            </div>

            <ResultsContainer data={sort.data} lastUpdate={sort.lastUpdate} totalLength={sort.allResultsLength} />

        </main>
    )

}

export default SearchPage