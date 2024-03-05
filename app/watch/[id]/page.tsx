import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult } from '../../ts/interfaces/apiAnilistDataInterface'
import gogoanime from '@/api/gogoanime'
import anilist from '@/api/anilist'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { EpisodeLinksGoGoAnime } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import EpisodesSideListContainer from './components/EpisodesSideListContainer'
import CommentSectionContainer from '@/app/components/CommentSectionContainer'
import aniwatch from '@/api/aniwatch'
import Player from './components/VideoPlayer'
import { EpisodeLinksAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { source: string, q: string } // EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    const episodeNumber = searchParams.source == "gogoanime" ?
        searchParams?.q.replace(/-/g, ' ').split(" ").map((item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bepisode\b/))
        :
        searchParams?.q.replace(/-/g, ' ').split(" ").map((item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bep\b/))

    return {
        title: `Watching Episode ${episodeNumber} - ${mediaData.title.romaji} | AniProject`,
        description: `Watch ${mediaData.title.romaji} ${episodeNumber}. ${mediaData.description && mediaData.description}}`,
    }
}

async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { source: string, q: string, episodeNumber?: string } // EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    let episodeData

    if (searchParams.source == "gogoanime") {

        episodeData = await gogoanime.getLinksForThisEpisode(searchParams.q) as EpisodeLinksGoGoAnime

    }
    else {

        episodeData = await aniwatch.episodesLinks(searchParams.q) as EpisodeLinksAnimeWatch

    }

    const episodeNumber = searchParams?.q.replace(/-/g, ' ').split(" ").map(
        (item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bepisode\b/)
        )

    return (
        <main id={styles.container}>

            {/* PLAYER */}
            <div className={styles.background}>
                <section id={styles.video_container}>
                    {searchParams.source == "gogoanime" ? (
                        <iframe
                            src={(episodeData as EpisodeLinksGoGoAnime).headers.Referer}
                            frameBorder="0"
                            allowFullScreen
                            width="100%"
                            height="260px"
                            scrolling="no"
                            title={mediaData.title.romaji + " Episode " + searchParams?.q.replace(/-/g, ' ').split(" ").map(
                                (item) => item[0].toUpperCase() + item.slice(1)).join(" ").slice(searchParams?.q.search(/\bepisode\b/))
                            }
                        />
                    ) : (

                        <Player source={episodeData.sources[0].url} subtitles={(episodeData as EpisodeLinksAnimeWatch).tracks} />

                    )}
                </section>
            </div>

            <div id={styles.media_info_container}>

                {/* SHOWS EPISODE ID SLICED FROM "EPISODE" WORD, AND ADD MEDIA NAME*/}
                {mediaData.format == "MOVIE" ? (
                    <h1 className='display_flex_row align_items_center'>{mediaData.title.romaji || mediaData.title.native}</h1>
                ) : (
                    <h1 className='display_flex_row align_items_center'>
                        {(searchParams.source == "animewatch") ? "Episode " : ""}{episodeNumber}
                        <span>{" "}-{" "}</span>
                        <span>{mediaData.title.romaji || mediaData.title.native}</span>
                    </h1>
                )}

                <div className={styles.grid} data-format={mediaData.format}>
                    <CardMediaCoverAndDescription data={mediaData} showButtons={false} />

                    {mediaData.format != "MOVIE" && (
                        <EpisodesSideListContainer
                            source={searchParams.source}
                            mediaId={params.id}
                            mediaTitle={mediaData.title.romaji}
                            episodeId={searchParams.q}
                        />
                    )}
                </div>
            </div>

            <div id={styles.comment_container}>

                <h2>COMMENTS {mediaData.format != "MOVIE" && (`FOR ${(searchParams.source == "animewatch") ? "EPISODE " : ""}${episodeNumber.toUpperCase()}`)}</h2>

                <CommentSectionContainer media={mediaData} onWatchPage={true} episodeId={searchParams.q} episodeNumber={Number(episodeNumber.replace("Episode ", ""))} />

            </div>
        </main>
    )
}

export default WatchEpisode