import React from "react";
import styles from "./page.module.css";
import { MediaData } from "../../ts/interfaces/anilistMediaData";
import * as MediaCardExpanded from "@/app/components/MediaCards/MediaInfoExpandedWithCover";
import {
  EpisodeLinksGoGoAnime,
  GogoanimeMediaEpisodes,
} from "@/app/ts/interfaces/gogoanimeData";
import EpisodesListContainer from "./components/EpisodesListContainer";
import VideoPlayer from "./components/VideoPlayer";
import {
  EpisodeAnimeWatch,
  EpisodeLinksAnimeWatch,
} from "@/app/ts/interfaces/aniwatchData";
import { ImdbEpisode } from "@/app/ts/interfaces/imdb";
import { SourceType } from "@/app/ts/interfaces/episodesSource";
import { cookies } from "next/headers";
import { getMediaInfo } from "@/app/api/mediaInfo/anilist/mediaInfo";
import {
  getAniwatchStreamingLink,
  getGogoanimeStreamingLink,
  getZoroStreamingLink,
  loadImdbMediaAndEpisodeInfo,
} from "./fetchFunctions";

export const revalidate = 900; // revalidate cached data every 15 minutes

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: number }; // ANILIST ANIME ID
  searchParams: { episode: string; dub?: string }; // EPISODE NUMBER, DUBBED
}) {
  const accessTokenCookie = cookies().get("access_token")?.value;

  const userAuthorization = accessTokenCookie
    ? JSON.parse(accessTokenCookie).accessToken
    : undefined;

  const mediaInfo = await getMediaInfo({
    id: params.id,
    accessToken: userAuthorization,
  });

  let pageTitle = "";

  if (mediaInfo.format == "MOVIE") {
    pageTitle = `Watch ${mediaInfo.title.userPreferred} | AniProject`;
  } else {
    // ACTES AS DEFAULT VALUE FOR PAGE PROPS
    if (Object.keys(searchParams).length === 0) searchParams = { episode: "1" };

    pageTitle = `Episode ${searchParams.episode} - ${mediaInfo.title.userPreferred} | AniProject`;
  }

  return {
    title: mediaInfo ? pageTitle : "Error | AniProject",
    description: !mediaInfo
      ? ""
      : `Watch ${mediaInfo.title.userPreferred}${
          mediaInfo.format != "MOVIE"
            ? ` - episode ${searchParams.episode} `
            : ""
        }${searchParams.dub ? "Dubbed" : ""}. ${
          mediaInfo.description
            ? mediaInfo.description.replace(/(<([^>]+)>)/gi, "")
            : ""
        }`,
  };
}

export default async function WatchEpisode({
  params,
  searchParams,
}: {
  params: { id: number }; // ANILIST ANIME ID
  searchParams: {
    episode: string;
    source: Omit<SourceType["source"], "crunchyroll">;
    q: string;
    t: string;
    dub?: string;
    alert?: string;
  }; // EPISODE NUMBER, SOURCE, EPISODE ID, TIME LAST STOP, DUBBED
}) {
  const accessTokenCookie = cookies().get("access_token")?.value;

  const userAuthorization = accessTokenCookie
    ? JSON.parse(accessTokenCookie).accessToken
    : undefined;

  const mediaInfo = await getMediaInfo({
    id: params.id,
    accessToken: userAuthorization,
  });

  // ACTES AS DEFAULT VALUE FOR PAGE PROPS
  if (Object.keys(searchParams).length === 0)
    searchParams = { episode: "1", source: "aniwatch", q: "", t: "0" };

  let isEpisodeFromTheSameMedia = false;

  if (!mediaInfo) {
    throw new Error("Media info not found");
  }

  let episodeData: EpisodeLinksGoGoAnime | EpisodeLinksAnimeWatch | null = null;
  let episodeSubtitles: EpisodeLinksAnimeWatch["tracks"] | undefined =
    undefined;
  const subtitleLanguage =
    cookies().get("subtitle_language")?.value || "English";
  let episodesList: EpisodeAnimeWatch[] | GogoanimeMediaEpisodes[] = [];
  let episodeUrl: string | undefined = undefined;
  let imdbEpisodeInfo: ImdbEpisode | undefined;
  const imdbEpisodesList: ImdbEpisode[] = [];

  async function getVideoStreamingLinkFromSource() {
    let info = null;

    switch (searchParams.source) {
      case "gogoanime":
        info = await getGogoanimeStreamingLink({
          episodeId: searchParams.q,
          mediaInfo,
          isDubbed: searchParams.dub == "true",
        });

        episodeData = info.episodeData;
        episodeUrl = info.episodeUrl;
        isEpisodeFromTheSameMedia = info.isEpisodeFromTheSameMedia;
        episodesList = info.episodesList;

        break;

      case "zoro":
        info = await getZoroStreamingLink({
          episodeId: searchParams.q,
          mediaInfo,
          isDubbed: searchParams.dub == "true",
        });

        episodeData = info.episodeData;
        episodeUrl = info.episodeUrl;
        isEpisodeFromTheSameMedia = info.isEpisodeFromTheSameMedia;
        episodesList = info.episodesList;

        break;

      case "aniwatch":
        info = await getAniwatchStreamingLink({
          episodeId: searchParams.q,
          mediaInfo,
          isDubbed: searchParams.dub == "true",
        });

        episodeData = info.episodeData;
        episodeUrl = info.episodeUrl;
        isEpisodeFromTheSameMedia = info.isEpisodeFromTheSameMedia;
        episodesList = info.episodesList;
        episodeSubtitles = info.episodeSubtitles;

        break;

      default:
        throw new Error("Source not found");
    }
  }

  await Promise.all([
    getVideoStreamingLinkFromSource(),
    (imdbEpisodeInfo = await loadImdbMediaAndEpisodeInfo({
      mediaInfo,
      currEpisode: searchParams.episode,
    })),
  ]);

  const episodeTitle = () => {
    if (searchParams.source == "gogoanime" || "zoro") {
      return (
        imdbEpisodesList[Number(searchParams.episode) - 1]?.title ||
        imdbEpisodeInfo?.title ||
        mediaInfo.title.userPreferred ||
        mediaInfo.title.romaji
      );
    } else {
      return (
        episodesList[Number(searchParams.episode) - 1] as EpisodeAnimeWatch
      )?.title;
    }
  };

  if (episodeUrl == undefined || episodeData == undefined) {
    throw new Error(`Episode data not found on ${searchParams.source}`);
  }

  if (isEpisodeFromTheSameMedia && searchParams?.alert == "true") {
    throw new Error("This episode doens't belong to this media! Try again!");
  }

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
              urlSource: episodeUrl,
              subtitleLang: subtitleLanguage,
              subtitlesList: episodeSubtitles,
              currentLastStop: searchParams.t || undefined,
              videoQualities: undefined,
              // videoQualities: searchParams.source == "gogoanime" ? (episodeData as EpisodeLinksGoGoAnime).sources : undefined
            }}
            episodeInfo={{
              episodeId: searchParams.q,
              episodeIntro:
                searchParams.source == "aniwatch"
                  ? (episodeData as EpisodeLinksAnimeWatch).intro
                  : undefined,
              episodeOutro: (episodeData as EpisodeLinksAnimeWatch)?.outro,
              episodeNumber: searchParams.episode,
              episodeImg:
                imdbEpisodesList[Number(searchParams.episode) - 1]?.img?.hd ||
                mediaInfo.bannerImage ||
                null,
            }}
          />
        </section>
      </div>

      <section id={styles.media_info_container}>
        <div id={styles.info_comments}>
          <div id={styles.heading_info_container}>
            <h1 className="display_flex_row align_items_center">
              {mediaInfo.format == "MOVIE" ? (
                mediaInfo.title.userPreferred
              ) : (
                <React.Fragment>
                  EP {searchParams.episode}
                  <span>{" - "}</span>
                  <span>{episodeTitle()}</span>
                </React.Fragment>
              )}
            </h1>

            {isEpisodeFromTheSameMedia && (
              <small id={styles.alert_wrong_media}>
                This video {`doesn't`} belong to this media
              </small>
            )}

            <MediaCardExpanded.Container mediaInfo={mediaInfo as MediaData}>
              <p>
                <MediaCardExpanded.Description
                  description={
                    imdbEpisodeInfo?.description || mediaInfo.description
                  }
                />
              </p>
            </MediaCardExpanded.Container>
          </div>
        </div>

        <div data-format={mediaInfo.format}>
          {mediaInfo.format != "MOVIE" && (
            <EpisodesListContainer
              sourceName={searchParams.source}
              anilistLastEpisodeWatched={
                mediaInfo.mediaListEntry?.progress || undefined
              }
              episodesList={episodesList}
              nextAiringEpisodeInfo={mediaInfo.nextAiringEpisode}
              episodesListOnImdb={
                imdbEpisodesList.length > 0 ? imdbEpisodesList : undefined
              }
              mediaId={params.id}
              activeEpisodeNumber={Number(searchParams.episode)}
            />
          )}
        </div>
      </section>
    </main>
  );
}
