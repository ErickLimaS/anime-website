import React from 'react'
import styles from "./page.module.css"
import KeepWatchingResults from './components/KeepWatchingResults'
import NavSideBar from './components/NavSideBar'
import SelectSort from '../components/SelectSortInputs'

export async function generateMetadata() {

    return {
        title: `History | AniProject`,
        description: `User History of Media Watched.`,
    }
}

function HistoryPage({ params, searchParams }: { params?: unknown, searchParams?: { format: string, sort: string } }) {

    return (
        <main id={styles.container}>

            <div id={styles.side_nav_container}>

                <NavSideBar params={searchParams} />

            </div>

            <section id={styles.main_content_container}>

                <div id={styles.heading_container}>

                    <h1>Latests Watched</h1>

                    <SelectSort options={
                        [
                            { name: "From A to Z", value: "title_asc" },
                            { name: "From Z to A", value: "title_desc" },
                        ]
                    } />

                </div>

                <KeepWatchingResults params={searchParams} />

            </section>

        </main>
    )
}

export default HistoryPage