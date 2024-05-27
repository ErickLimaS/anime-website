import React from 'react'
import styles from "./page.module.css"
import { ApiDefaultResult, ApiMediaResults } from '../../ts/interfaces/apiAnilistDataInterface'
import gogoanime from '@/app/api/consumetGoGoAnime'
import anilist from '@/app/api/anilist'
import * as MediaCardExpanded from '@/app/components/MediaCards/MediaInfoExpandedWithCover'
import { EpisodeLinksGoGoAnime, MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import EpisodesListContainer from './components/EpisodesSideListContainer'
import CommentsSection from '@/app/components/CommentsSection'
import aniwatch from '@/app/api/aniwatch'
import VideoPlayer from './components/VideoPlayer'
import { EpisodeAnimeWatch, EpisodeLinksAnimeWatch } from '@/app/ts/interfaces/apiAnimewatchInterface'
import { fetchWithAniWatch, fetchWithGoGoAnime } from '@/app/lib/fetchAnimeOptions'
import { ImdbEpisode, ImdbMediaInfo } from '@/app/ts/interfaces/apiImdbInterface'
import { getMediaInfo } from '@/app/api/consumetImdb'
import Image from 'next/image'
import ErrorImg from "@/public/error-img-4.png"
import Link from 'next/link'
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface'

export const revalidate = 900 // revalidate cached data every 15 minutes

export async function generateMetadata({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string } // EPISODE NUMBER
}) {

    // ACTES AS DEFAULT VALUE FOR PAGE PROPS
    if (Object.keys(searchParams).length === 0) searchParams = { episode: "1" }

    const mediaInfo = await anilist.getMediaInfo(params.id) as ApiDefaultResult

    return {
        title: !mediaInfo ? "Error | AniProject" : `Episode ${searchParams.episode} - ${mediaInfo.title.romaji} | AniProject`,
        description: !mediaInfo ? "" : `Watch ${mediaInfo.title.romaji}, episode ${searchParams.episode}. ${mediaInfo.description && mediaInfo.description}`,
    }

}

export default async function WatchEpisode({ params, searchParams }: {
    params: { id: number }, // ANILIST ANIME ID
    searchParams: { episode: string, source: SourceType["source"], q: string, t: string } // EPISODE NUMBER, SOURCE, EPISODE ID, TIME LAST STOP
}) {

    // ACTES AS DEFAULT VALUE FOR PAGE PROPS
    if (Object.keys(searchParams).length === 0) searchParams = { episode: "1", source: "aniwatch", q: "", t: "0" }

    const mediaInfo = await anilist.getMediaInfo(params.id) as ApiMediaResults

    let hadFetchError = false

    if (!mediaInfo) hadFetchError = true

    if (hadFetchError) return <FetchEpisodeError mediaId={params.id} searchParams={searchParams} />

    // get media info on imdb
    const imdbMediaInfo: ImdbMediaInfo = await getMediaInfo(true, undefined, undefined, mediaInfo.title.romaji, mediaInfo.startDate.year) as ImdbMediaInfo

    // get episodes on imdb
    imdbMediaInfo?.seasons?.map(itemA => itemA.episodes?.map(itemB => imdbEpisodesList.push(itemB)))

    let episodeDataFetched: EpisodeLinksGoGoAnime | EpisodeLinksAnimeWatch | null = null
    let episodeSubtitles: EpisodeLinksAnimeWatch["tracks"] | undefined = undefined
    let episodesList: EpisodeAnimeWatch[] | MediaEpisodes[] = []
    let videoUrlSrc: string | undefined = undefined
    let imdbEpisodesList: ImdbEpisode[] = []

    function compareEpisodeIDs(episodesList: { id?: string, episodeId?: string }[], sourceName: SourceType["source"]) {

        // Compare Episode ID from params with episodes fetched ID

        switch (sourceName) {
            case "aniwatch":
                const aniwatchEpisodeIdFromParamsIsOnEpisodesList = episodesList.find(episode => episode.episodeId == searchParams.q)

                return aniwatchEpisodeIdFromParamsIsOnEpisodesList == undefined

            case 'gogoanime':

                const gogoanimeEpisodeIdFromParamsIsOnEpisodesList = episodesList.find(episode => episode.id == searchParams.q)

                return gogoanimeEpisodeIdFromParamsIsOnEpisodesList == undefined

            default:
                return false
        }

    }

    switch (searchParams.source) {

        case ("gogoanime"):

            episodeDataFetched = await gogoanime.getEpisodeStreamingLinks2(searchParams.q) as EpisodeLinksGoGoAnime

            if (!episodeDataFetched) {

                hadFetchError = true

                break

            }

            // Episode link source
            videoUrlSrc = episodeDataFetched.sources.find(item => item.quality == "default").url
            if (!videoUrlSrc) videoUrlSrc = episodeDataFetched.sources[0].url

            // Episodes for this media
            episodesList = await fetchWithGoGoAnime(mediaInfo.title.romaji, "episodes") as MediaEpisodes[]

            hadFetchError = compareEpisodeIDs(episodesList, "gogoanime")

            break

        case ("aniwatch"):

            if (!searchParams.q) {

                episodesList = await fetchWithAniWatch(mediaInfo.title.romaji, "episodes") as EpisodeAnimeWatch[]

                searchParams.q = episodesList[0].episodeId

            }

            // fetch episode data
            episodeDataFetched = await aniwatch.episodesLinks(searchParams.q) as EpisodeLinksAnimeWatch

            if (!episodeDataFetched) hadFetchError = true

            // fetch episode link source
            videoUrlSrc = episodeDataFetched.sources[0].url

            // fetch episodes for this media
            if (episodesList.length == 0) {
                episodesList = await fetchWithAniWatch(
                    mediaInfo.title.romaji,
                    "episodes",
                    mediaInfo.format,
                    undefined,
                    searchParams?.q?.split("?")[0]
                ) as EpisodeAnimeWatch[]
            }

            episodeSubtitles = episodeDataFetched.tracks

            hadFetchError = compareEpisodeIDs(episodesList, "aniwatch")

            break

        default:
            hadFetchError = true

    }

    const imdbEpisodeInfo = imdbEpisodesList?.find(item => item.episode == Number(searchParams.episode))

    if (hadFetchError) return <FetchEpisodeError mediaId={params.id} searchParams={searchParams} />

    return (
        <main id={styles.container}>

            {/* PLAYER */}
            <div className={styles.background}>
                <section id={styles.video_container}>

                    <VideoPlayer
                        mediaEpisodes={episodesList}
                        mediaSource={searchParams.source}
                        mediaInfo={mediaInfo}
                        videoInfo={{
                            urlSource: videoUrlSrc as string,
                            subtitlesList: episodeSubtitles,
                            currentLastStop: searchParams.t || undefined,
                            videoQualities: undefined,
                            // videoQualities: searchParams.source == "gogoanime" ? (episodeData as EpisodeLinksGoGoAnime).sources : undefined
                        }}
                        episodeInfo={{
                            episodeId: searchParams.q,
                            episodeIntro: (episodeDataFetched as EpisodeLinksAnimeWatch)?.intro,
                            episodeOutro: (episodeDataFetched as EpisodeLinksAnimeWatch)?.outro,
                            episodeNumber: searchParams.episode,
                            episodeImg: imdbEpisodesList[Number(searchParams.episode) - 1]?.img?.hd || mediaInfo.bannerImage || null,
                        }}
                    />

                </section>
            </div>

            <section id={styles.media_info_container}>

                <div id={styles.info_comments}>

                    <div id={styles.heading_info_container}>

                        {mediaInfo.format == "MOVIE" ? (
                            <h1 className='display_flex_row align_items_center'>
                                {mediaInfo.title.romaji || mediaInfo.title.native}
                            </h1>
                        ) : (
                            <h1>
                                {`EP ${searchParams.episode}`}
                                <span>{" "}-{" "}</span>
                                <span>
                                    {searchParams.source == "gogoanime" ?
                                        imdbEpisodesList[Number(searchParams.episode)]?.title || imdbEpisodeInfo?.title || mediaInfo.title.romaji || mediaInfo.title.native
                                        :
                                        (episodesList[Number(searchParams.episode) - 1] as EpisodeAnimeWatch)?.title
                                    }
                                </span>
                            </h1>
                        )}

                        <MediaCardExpanded.Container
                            mediaInfo={mediaInfo as ApiDefaultResult}
                        >

                            <MediaCardExpanded.Description
                                description={imdbEpisodeInfo?.description || mediaInfo.description}
                            />

                        </MediaCardExpanded.Container>

                    </div>

                    <div className={styles.only_desktop}>

                        <div className={styles.comment_container}>

                            <h2>COMMENTS {mediaInfo.format != "MOVIE" && (`FOR EPISODE ${searchParams.episode}`)}</h2>

                            {/* ONLY ON DESKTOP */}
                            <CommentsSection
                                mediaInfo={mediaInfo}
                                isOnWatchPage={true}
                                episodeId={searchParams.q}
                                episodeNumber={Number(searchParams.episode)}
                            />
                        </div>

                    </div>

                </div>

                <div data-format={mediaInfo.format}>

                    {mediaInfo.format != "MOVIE" && (
                        <EpisodesListContainer
                            sourceName={searchParams.source}
                            episodesList={episodesList}
                            nextAiringEpisodeInfo={mediaInfo.nextAiringEpisode}
                            episodesListOnImdb={imdbEpisodesList.length > 0 ? imdbEpisodesList : undefined}
                            mediaId={params.id}
                            activeEpisodeNumber={Number(searchParams.episode)}
                        />
                    )}

                    {/* ONLY ON MOBILE */}
                    <div className={styles.only_mobile}>

                        <div className={styles.comment_container}>

                            <h2>COMMENTS {mediaInfo.format != "MOVIE" && (`FOR EPISODE ${searchParams.episode}`)}</h2>

                            <CommentsSection
                                mediaInfo={mediaInfo}
                                isOnWatchPage={true}
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

export function FetchEpisodeError({ mediaId, searchParams }: { mediaId: number, searchParams: { source: SourceType["source"] } }) {

    return (
        <div id={styles.error_modal_container}>

            <div id={styles.heading_text_container}>
                <div>
                    <Image src={ErrorImg} height={330} alt={'Error'} />
                </div>

                <h1>ERROR!</h1>

                <p>What could have happened: </p>

                <ul>
                    <li>Media ID <b>{mediaId}</b> might be wrong.</li>
                    <li><b>{searchParams.source}</b> {`doesn't have this media available.`}</li>
                    <li>{`The Media ID doesn't match episode ID on ${searchParams.source}.`}</li>
                    <li>Problems With Server.</li>
                    <li><b>{searchParams.source} API</b> had recent changes and/or not available.</li>
                </ul>
            </div>


            <div id={styles.redirect_btns_container}>
                <Link href={`/media/${mediaId}`}>
                    Return To Media Page
                </Link>

                <Link href={"/"}>
                    Return to Home Page
                </Link>

            </div>

        </div>
    )

}