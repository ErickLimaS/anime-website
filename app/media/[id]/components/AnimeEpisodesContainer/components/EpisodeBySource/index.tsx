import { EpisodesType, ApiDefaultResult, ApiMediaResults } from "@/app/ts/interfaces/apiAnilistDataInterface";
import { EpisodeAnimeWatch } from "@/app/ts/interfaces/apiAnimewatchInterface";
import { MediaEpisodes } from "@/app/ts/interfaces/apiGogoanimeDataInterface";
import { ImdbEpisode, ImdbMediaInfo } from "@/app/ts/interfaces/apiImdbInterface";
import { SourceType } from "@/app/ts/interfaces/episodesSourceInterface";
import AniwatchEpisode from "./aniwatch";
import CrunchyrollEpisode from "./crunchyroll";
import GoGoAnimeEpisode from "./gogoanime";

type EpisodesContainerTypes = {
    imdb: {
        mediaSeasons: ImdbMediaInfo["seasons"],
        episodesList: ImdbEpisode[],
    },
    mediaInfo: ApiDefaultResult | ApiMediaResults,
    crunchyrollInitialEpisodes: EpisodesType[],
    episodesWatchedOnAnilist?: number
}

const framerMotionEpisodePopup = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1
        }
    }
}

export function EpisodeBySource(
    { episodeInfo, currEpisodesSource, currEpisodesWatched, itemOffset, mediaInfo, index, imdb, crunchyrollInitialEpisodes, wasEpisodeWatchedOnAnilist, useDubbedRoute }: {
        episodeInfo: ImdbEpisode | EpisodesType | MediaEpisodes | EpisodeAnimeWatch,
        currEpisodesSource: SourceType["source"],
        currEpisodesWatched?: {
            mediaId: number;
            episodeNumber: number;
            episodeTitle: string;
        }[],
        itemOffset: number,
        mediaInfo: ApiDefaultResult | ApiMediaResults,
        index: number,
        imdb: EpisodesContainerTypes["imdb"],
        crunchyrollInitialEpisodes: EpisodesContainerTypes["crunchyrollInitialEpisodes"],
        useDubbedRoute: boolean,
        wasEpisodeWatchedOnAnilist?: boolean
    }) {

    switch (currEpisodesSource) {

        case "crunchyroll":

            return (

                <CrunchyrollEpisode
                    motionStyle={framerMotionEpisodePopup}
                    key={index}
                    episodeInfo={episodeInfo as EpisodesType}
                    episodeNumber={index + itemOffset + 1}
                    mediaId={mediaInfo.id}
                    episodesWatchedInfo={currEpisodesWatched}
                />

            )

        case "gogoanime":

            return (

                <GoGoAnimeEpisode
                    motionStyle={framerMotionEpisodePopup}
                    key={index}
                    wasEpisodeWatchedOnAnilist={wasEpisodeWatchedOnAnilist}
                    episodeInfo={episodeInfo as MediaEpisodes}
                    episodeNumber={index + itemOffset + 1}
                    episodeTitle={imdb.episodesList[index + itemOffset]?.title}
                    episodeDescription={imdb.episodesList[index + itemOffset]?.description || undefined}
                    backgroundImg={imdb.episodesList[index + itemOffset]?.img?.hd || crunchyrollInitialEpisodes[index + itemOffset]?.thumbnail}
                    mediaId={mediaInfo.id}
                    episodesWatchedInfo={currEpisodesWatched}
                    useDubbedRoute={useDubbedRoute}
                />

            )

        case "aniwatch":

            return (

                <AniwatchEpisode
                    motionStyle={framerMotionEpisodePopup}
                    key={index}
                    wasEpisodeWatchedOnAnilist={wasEpisodeWatchedOnAnilist}
                    episodeInfo={episodeInfo as EpisodeAnimeWatch}
                    episodeNumber={index + itemOffset + 1}
                    episodeDescription={imdb.episodesList[index + itemOffset]?.description || undefined}
                    episodeImg={imdb.episodesList[index + itemOffset]?.img?.hd || crunchyrollInitialEpisodes[index + itemOffset]?.thumbnail}
                    mediaId={mediaInfo.id}
                    episodesWatchedInfo={currEpisodesWatched}
                    useDubbedRoute={useDubbedRoute}
                />

            )

        default:
            return (<></>)

    }

}