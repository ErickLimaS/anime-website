import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
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
    searchParams: { episode: string, source: string, q: string } // EPISODE NUMBER, SOURCE, EPISODE ID
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    return {
        title: `Watching EP ${searchParams.episode} - ${mediaData.title.romaji} | AniProject`,
        description: `Watch ${mediaData.title.romaji}, episode ${searchParams.episode}. ${mediaData.description && mediaData.description}}`,
    }
}

async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string, source: string, q: string, t: string } // EPISODE NUMBER, SOURCE, EPISODE ID, TIME LAST STOP
}) {

    const mediaData = await anilist.getMediaInfo(params.id) as ApiMediaResults

    let episodeData

    if (searchParams.source == "gogoanime") {

        episodeData = await gogoanime.getLinksForThisEpisode(searchParams.q) as EpisodeLinksGoGoAnime

    }
    else {

        episodeData = await aniwatch.episodesLinks(searchParams.q) as EpisodeLinksAnimeWatch

    }

    let videoSrc: string

    if (searchParams.source == "gogoanime") {

        videoSrc = (episodeData as EpisodeLinksGoGoAnime).sources.find(item => item.quality == "default").url

        if (!videoSrc) videoSrc = (episodeData as EpisodeLinksGoGoAnime).sources[0].url

    }
    else {
        videoSrc = episodeData.sources[0].url
    }

    return (
        <main id={styles.container}>

            {/* PLAYER */}
            <div className={styles.background}>
                <section id={styles.video_container}>
                    <Player
                        source={videoSrc}
                        currentLastStop={searchParams.t || undefined}
                        mediaSource={searchParams.source}
                        media={mediaData}
                        episode={searchParams.episode}
                        episodeId={searchParams.q}
                        subtitles={searchParams.source == "gogoanime" ? undefined : (episodeData as EpisodeLinksAnimeWatch).tracks}
                        videoQualities={searchParams.source == "gogoanime" ? (episodeData as EpisodeLinksGoGoAnime).sources : undefined}
                    />
                </section>
            </div>

            <section id={styles.media_info_container}>

                <div id={styles.info_comments}>

                    <div id={styles.heading_info_container}>

                        {mediaData.format == "MOVIE" ? (
                            <h1 className='display_flex_row align_items_center'>{mediaData.title.romaji || mediaData.title.native}</h1>
                        ) : (
                            <h1 className='display_flex_row align_items_center'>
                                Episode {searchParams.episode}
                                <span>{" "}-{" "}</span>
                                <span>{mediaData.title.romaji || mediaData.title.native}</span>
                            </h1>
                        )}

                        <CardMediaCoverAndDescription data={mediaData as ApiDefaultResult} showButtons={false} />

                    </div>

                    <div className={styles.only_desktop}>

                        <div className={styles.comment_container}>

                            <h2>COMMENTS {mediaData.format != "MOVIE" && (`FOR EPISODE ${searchParams.episode}`)}</h2>

                            {/* ONLY ON DESKTOP */}
                            <CommentSectionContainer
                                media={mediaData}
                                onWatchPage={true}
                                episodeId={searchParams.q}
                                episodeNumber={Number(searchParams.episode)}
                            />
                        </div>

                    </div>

                </div>

                <div data-format={mediaData.format}>

                    {mediaData.format != "MOVIE" && (
                        <EpisodesSideListContainer
                            source={searchParams.source}
                            sourceMediaId={searchParams.q.slice(0, searchParams?.q.search(/\bep\b/))}
                            mediaId={params.id}
                            mediaTitle={mediaData.title.romaji}
                            activeEpisodeNumber={Number(searchParams.episode)}
                            totalEpisodes={mediaData.nextAiringEpisode ?
                                mediaData.nextAiringEpisode.episode - 1 : mediaData.episodes // work around to api gogoanime not showing episodes
                            }
                        />
                    )}

                    {/* ONLY ON MOBILE */}
                    <div className={styles.only_mobile}>

                        <div className={styles.comment_container}>

                            <h2>COMMENTS {mediaData.format != "MOVIE" && (`FOR EPISODE ${searchParams.episode}`)}</h2>

                            <CommentSectionContainer
                                media={mediaData}
                                onWatchPage={true}
                                episodeId={searchParams.q}
                                episodeNumber={Number(searchParams.episode)}
                            />
                        </div>

                    </div>

                </div>

            </section>

        </main>
    )
}

export default WatchEpisode