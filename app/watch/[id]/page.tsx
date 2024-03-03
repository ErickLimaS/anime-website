import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult } from '../../ts/interfaces/apiAnilistDataInterface'
import gogoanime from '@/api/gogoanime'
import anilist from '@/api/anilist'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { EpisodeLinks } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import EpisodesSideListContainer from './components/EpisodesSideListContainer'
import CommentSectionContainer from '@/app/components/CommentSectionContainer'

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { q: string } // EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    const episodeNumber = searchParams?.q.replace(/-/g, ' ').split(" ").map((item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bepisode\b/))

    return {
        title: `Watching ${episodeNumber} - ${mediaData.title.romaji} | AniProject`,
        description: `Watch ${mediaData.title.romaji} ${episodeNumber}. ${mediaData.description && mediaData.description}}`,
    }
}

async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { q: string } // EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    const episodeData = await gogoanime.getLinksForThisEpisode(searchParams.q) as EpisodeLinks

    const episodeNumber = searchParams?.q.replace(/-/g, ' ').split(" ").map(
        (item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bepisode\b/)
        )

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
                        title={mediaData.title.romaji + " Episode " + searchParams?.q.replace(/-/g, ' ').split(" ").map(
                            (item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bepisode\b/))
                        }
                    />
                </section>
            </div>


            <div id={styles.media_info_container}>

                {/* SHOWS EPISODE ID SLICED FROM "EPISODE" WORD, AND ADD MEDIA NAME*/}
                {mediaData.format == "MOVIE" ? (
                    <h1 className='display_flex_row align_items_center'>{mediaData.title.romaji || mediaData.title.native}</h1>
                ) : (
                    <h1 className='display_flex_row align_items_center'>
                        {episodeNumber}
                        <span>{" "}-{" "}</span>
                        <span>{mediaData.title.romaji || mediaData.title.native}</span>
                    </h1>
                )}

                <div className={styles.grid} data-format={mediaData.format}>
                    <CardMediaCoverAndDescription data={mediaData} showButtons={false} />

                    {mediaData.format != "MOVIE" && (
                        <EpisodesSideListContainer mediaId={params.id} mediaTitle={mediaData.title.romaji} episodeId={searchParams.q} />
                    )}
                </div>
            </div>

            <div id={styles.comment_container}>

                <h2>COMMENTS {mediaData.format != "MOVIE" && (`FOR ${episodeNumber.toUpperCase()}`)}</h2>

                <CommentSectionContainer media={mediaData} onWatchPage={true} episodeId={searchParams.q} episodeNumber={Number(episodeNumber.replace("Episode ", ""))} />

            </div>
        </main>
    )
}

export default WatchEpisode