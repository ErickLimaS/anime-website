import React, { Suspense } from 'react'
import styles from "./page.module.css"
import PlaylistItemsResults from './components/PlaylistItemsResults'
import NavSideBar from './components/NavSideBar'

export async function generateMetadata() {

    return {
        title: `Playlist | AniProject`,
        description: `User Playlist.`,
    }
}

function PlaylistPage({ params, searchParams }: { params?: unknown, searchParams?: { format: string } }) {

    return (
        <main id={styles.container}>

            <div id={styles.side_nav_container}>

                <h2>FILTER BY</h2>

                <NavSideBar params={searchParams} />

            </div>

            <section id={styles.main_content_container}>

                <h1>Playlist</h1>

                <Suspense fallback={<p>loading...</p>}>
                    <PlaylistItemsResults params={searchParams} />
                </Suspense>

            </section>

        </main>
    )
}

export default PlaylistPage