import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
import gogoanime from '@/app/api/consumetGoGoAnime'
import anilist from '@/app/api/anilist'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { EpisodeLinksGoGoAnime, MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import EpisodesSideListContainer from './components/EpisodesSideListContainer'
import CommentSectionContainer from '@/app/components/CommentSectionContainer'
import aniwatch from '@/app/api/aniwatch'
import Player from './components/VideoPlayer'
import { EpisodeAnimeWatch, EpisodeLinksAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import { fetchWithAniWatch, fetchWithGoGoAnime } from '@/app/lib/fetchAnimeOnApi'
import { ImdbEpisode, ImdbMediaInfo } from '@/app/ts/interfaces/apiImdbInterface'
import { getMediaInfo } from '@/app/api/consumetImdb'
import Image from 'next/image'
import ErrorImg from "@/public/error-img-4.png"
import Link from 'next/link'
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface'

export const revalidate = 900 // revalidate cached data every 15 minutes

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string } // EPISODE NUMBER, SOURCE, EPISODE ID
}) {

    // ACTES AS DEFAULT VALUE FOR PAGE PROPS
    if (Object.keys(searchParams).length === 0) {
        searchParams = { episode: "1" }
    }

    const mediaData = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    return {
        title: `Episode ${searchParams.episode} - ${mediaData.title.romaji} | AniProject`,
        description: `Watch ${mediaData.title.romaji}, episode ${searchParams.episode}. ${mediaData.description && mediaData.description}`,
    }

}

async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string, source: SourceType["source"], q: string, t: string } // EPISODE NUMBER, SOURCE, EPISODE ID, TIME LAST STOP
}) {

    // ACTES AS DEFAULT VALUE FOR PAGE PROPS
    if (Object.keys(searchParams).length === 0) {
        searchParams = { episode: "1", source: "aniwatch", q: "", t: "0" }
    }

    const mediaData = await anilist.getMediaInfo(params.id) as ApiMediaResults

    let episodeData
    let episodeSubtitles: EpisodeLinksAnimeWatch["tracks"] | undefined
    let episodes: EpisodeAnimeWatch[] | MediaEpisodes[] = []
    let videoSrc: string | undefined = undefined
    let imdbEpisodes: ImdbEpisode[] = [] 
    let error = false

    switch (searchParams.source) {

        case ("gogoanime"):

            // fetch episode data
            episodeData = await gogoanime.getEpisodeStreamingLinks2(searchParams.q) as EpisodeLinksGoGoAnime

            if (!episodeData) error = true

            if (episodeData) {

                // fetch episode link source
                videoSrc = (episodeData as EpisodeLinksGoGoAnime).sources.find(item => item.quality == "default").url
                if (!videoSrc) videoSrc = (episodeData as EpisodeLinksGoGoAnime).sources[0].url

                // fetch episodes for this media
                episodes = await fetchWithGoGoAnime(mediaData.title.romaji, "episodes") as MediaEpisodes[]

                // if episode on params dont match any of EPISODES results, it shows a error
                if (episodes.find(item => item.id == searchParams.q) == undefined) error = true

            }

            break

        case ("aniwatch"):

            if (!searchParams.q) {

                episodes = await fetchWithAniWatch(mediaData.title.romaji, "episodes") as EpisodeAnimeWatch[]

                searchParams.q = episodes[0].episodeId

            }

            // fetch episode data
            episodeData = await aniwatch.episodesLinks(searchParams.q) as EpisodeLinksAnimeWatch

            if (!episodeData) error = true

            if (episodeData) {

                // fetch episode link source
                videoSrc = episodeData.sources[0].url

                // fetch episodes for this media
                if (episodes.length == 0) episodes = await fetchWithAniWatch(
                    mediaData.title.romaji,
                    "episodes",
                    mediaData.format,
                    undefined,
                    searchParams?.q?.split("?")[0]
                ) as EpisodeAnimeWatch[]

                episodeSubtitles = episodeData.tracks

                // if episode on params dont match any of EPISODES results, it shows a error
                if ((episodes as EpisodeAnimeWatch[]).find((item) => item.episodeId == searchParams.q) == undefined) error = true

            }

            break

        default:

            error = true

    }

    // get media info on imdb
    const imdbMediaInfo: ImdbMediaInfo = await getMediaInfo(true, undefined, undefined, mediaData.title.romaji, mediaData.startDate.year) as ImdbMediaInfo

    // get episodes on imdb
    imdbMediaInfo?.seasons?.map(itemA => itemA.episodes?.map(itemB => imdbEpisodes.push(itemB)))

    // ERROR MESSAGE
    if (error) {
        return (
            <div id={styles.error_modal_container}>

                <div id={styles.heading_text_container}>
                    <div>
                        <Image src={ErrorImg} height={330} alt={'Error'} />
                    </div>

                    <h1>ERROR!</h1>

                    <p>What could have happened: </p>

                    <ul>
                        <li>{`${searchParams.source} doesn't have this media available.`}</li>
                        <li>{`The Media ID doesn't match episode ID on ${searchParams.source}.`}</li>
                        <li>{`Problems With Server.`}</li>
                        <li>{`${searchParams.source} API changes or not available.`}</li>
                    </ul>
                </div>


                <div id={styles.redirect_btns_container}>
                    <Link href={`/media/${params.id}`}>
                        Return To Media Page
                    </Link>

                    <Link href={"/"}>
                        Return to Home Page
                    </Link>

                </div>

            </div>
        )
    }

    return (
        <main id={styles.container}>

            {/* PLAYER */}
            <div className={styles.background}>
                <section id={styles.video_container}>
                    <Player
                        source={videoSrc as string}
                        currentLastStop={searchParams.t || undefined}
                        mediaSource={searchParams.source}
                        media={mediaData}
                        episodeIntro={(episodeData as EpisodeLinksAnimeWatch)?.intro}
                        episodeOutro={(episodeData as EpisodeLinksAnimeWatch)?.outro}
                        episodeNumber={searchParams.episode}
                        episodeImg={imdbEpisodes[Number(searchParams.episode) - 1]?.img?.hd || mediaData.bannerImage || null}
                        mediaEpisodes={episodes}
                        episodeId={searchParams.q}
                        subtitles={episodeSubtitles}
                        // videoQualities={searchParams.source == "gogoanime" ? (episodeData as EpisodeLinksGoGoAnime).sources : undefined}
                        videoQualities={undefined}
                    />
                </section>
            </div>

            <section id={styles.media_info_container}>

                <div id={styles.info_comments}>

                    <div id={styles.heading_info_container}>

                        {mediaData.format == "MOVIE" ? (
                            <h1 className='display_flex_row align_items_center'>
                                {mediaData.title.romaji || mediaData.title.native}
                            </h1>
                        ) : (
                            <h1>
                                {`EP ${searchParams.episode}`}
                                <span>{" "}-{" "}</span>
                                <span>
                                    {
                                        imdbEpisodes?.find(item => item.episode == Number(searchParams.episode))?.title
                                        ||
                                        mediaData.title.romaji
                                        ||
                                        mediaData.title.native
                                    }
                                </span>
                            </h1>
                        )}

                        <CardMediaCoverAndDescription
                            data={mediaData as ApiDefaultResult}
                            showButtons={false}
                            customDescription={imdbEpisodes?.find(item => item.episode == Number(searchParams.episode))?.description || undefined}
                        />

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
                            episodesList={episodes}
                            nextAiringEpisode={mediaData.nextAiringEpisode}
                            episodesOnImdb={imdbEpisodes.length > 0 ? imdbEpisodes : undefined}
                            mediaId={params.id}
                            activeEpisodeNumber={Number(searchParams.episode)}
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