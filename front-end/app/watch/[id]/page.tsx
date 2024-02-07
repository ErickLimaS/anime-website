import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult } from '../../ts/interfaces/apiAnilistDataInterface'
import gogoanime from '@/api/gogoanime'
import anilist from '@/api/anilist'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { EpisodeLinks } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import EpisodesSideListContainer from '@/app/components/EpisodesSideListContainer'

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { q: string } // EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    return {
        title: `Watching ${mediaData.title.romaji} | AniProject`,
        description: `Watch ${mediaData.title.romaji}. ${mediaData.description && mediaData.description}}`,
    }
}

async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { q: string } // EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    const episodeData = await gogoanime.getLinksForThisEpisode(searchParams.q) as EpisodeLinks

    console.log(episodeData)
    return (
        <main id={styles.container}>

            {/* PLAYER */}
            <div className={styles.background}>
                <section id={styles.video_container}>
                    <iframe
                        src={episodeData.headers.Referer}
                        frameBorder="0"
                        allowFullScreen
                        width="100%"
                        height="260px"
                        scrolling="no"
                    />
                </section>
            </div>


            <div id={styles.media_info_container}>

                <h1>
                    {searchParams?.q.replace(/-/g, ' ').split(" ").map((item) => item[0].toUpperCase() + item.slice(1)).join(" ")}
                </h1>

                <div className={styles.grid}>
                    <CardMediaCoverAndDescription data={mediaData} showButtons={false} />

                    <EpisodesSideListContainer mediaId={params.id} mediaTitle={mediaData.title.romaji} episodeId={searchParams.q} />
                </div>
            </div>

        </main>
    )
}

export default WatchEpisode