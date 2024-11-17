import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import React from "react";
import anilist from "@/app/api/anilist/anilistMedias";
import styles from "./page.module.css";
import Image from "next/image";
import parse from "html-react-parser";
import * as MediaCard from "@/app/components/MediaCards/MediaCard";
import EpisodesContainer from "./components/AnimeEpisodesContainer";
import MangaChaptersContainer from "./components/MangaChaptersContainer";
import ScoreRating from "@/app/components/DynamicAssets/ScoreRating";
import { headers } from "next/headers";
import { checkDeviceIsMobile } from "@/app/lib/checkMobileOrDesktop";
import { convertFromUnix, getMediaReleaseDate } from "@/app/lib/formatDateUnix";
import { getMediaInfoOnIMDB } from "@/app/api/consumet/consumetImdb";
import { ImdbEpisode, ImdbMediaInfo } from "@/app/ts/interfaces/imdb";
import MediaRelatedContainer from "./components/MediaRelatedContainer";
import PageHeading from "./components/PageHeading";
import Reviews from "./components/Reviews";

export const revalidate = 43200; // revalidate cached data every 12 hours

export async function generateMetadata({ params }: { params: { id: number } }) {
  const mediaData = (await anilist.getMediaInfo({
    id: params.id,
    accessToken: headers().get("Authorization")?.slice(7),
  })) as MediaDataFullInfo;

  return {
    title: `${mediaData.title.romaji || mediaData.title.native} | AniProject`,
    description:
      mediaData.description ||
      `See more info about ${mediaData.title.romaji || mediaData.title.native}`,
    keywords: [
      mediaData.title.romaji,
      mediaData.title.english,
      mediaData.title.native,
      `${mediaData.title.romaji} anime`,
      `${mediaData.title.romaji} release`,
      `${mediaData.title.english} release`,
      "anime info",
    ],
  };
}

export default async function MediaPage({
  params,
  searchParams,
}: {
  params: { id: number };
  searchParams: { lang?: string };
}) {
  const isOnMobileScreen = checkDeviceIsMobile(headers()) || false;

  const mediaInfo = (await anilist.getMediaInfo({
    id: params.id,
    accessToken: headers().get("Authorization")?.slice(7),
  })) as MediaDataFullInfo;

  // GET MEDIA INFO ON IMDB
  const imdbMediaInfo = (await getMediaInfoOnIMDB({
    search: true,
    seachTitle: mediaInfo.title.romaji,
    releaseYear: mediaInfo.startDate.year,
  })) as ImdbMediaInfo;

  function getCrunchyrollEpisodes() {
    const sortEpisodesByEpisode = mediaInfo.streamingEpisodes?.sort((a, b) => {
      const numA = Number(
        a.title.slice(a.title?.search(/\b \b/), a.title?.search(/\b - \b/))
      );
      const numB = Number(
        b.title.slice(b.title?.search(/\b \b/), b.title?.search(/\b - \b/))
      );

      return numA - numB;
    });

    return sortEpisodesByEpisode;
  }

  // GET MEDIA EPISODES ON IMDB
  function getImdbEpisodesListWithNoSeasons() {
    const imdbEpisodesMapped: ImdbEpisode[] = [];

    imdbMediaInfo?.seasons?.map((itemA) =>
      itemA.episodes?.map((itemB) => imdbEpisodesMapped.push(itemB))
    );

    return imdbEpisodesMapped;
  }

  function randomizeBcgImg() {
    const backgroundImgs: { url: string }[] = [];

    if (mediaInfo?.bannerImage)
      backgroundImgs.push({ url: mediaInfo?.bannerImage });
    if (imdbMediaInfo?.cover)
      backgroundImgs.push({ url: imdbMediaInfo?.cover });

    const randomNumber = Math.floor(Math.random() * backgroundImgs?.length);

    return backgroundImgs[randomNumber]?.url;
  }

  function bcgImgBasedOnScreenDisplay() {
    if (isOnMobileScreen) {
      return `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${mediaInfo?.coverImage?.extraLarge})`;
    } else {
      return `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${
        mediaInfo.format == "MANGA" ? mediaInfo.bannerImage : randomizeBcgImg()
      })`;
    }
  }

  return (
    <main id={styles.container}>
      {/* BANNER or BACKGROUND COLOR*/}
      <div
        id={styles.banner_background_container}
        style={{ background: bcgImgBasedOnScreenDisplay() }}
      />

      <div
        id={styles.media_info_container}
        className={
          imdbMediaInfo?.logos && imdbMediaInfo?.logos[0]
            ? `${styles.custom_position}`
            : ``
        }
      >
        <PageHeading
          searchParams={searchParams}
          mediaInfo={mediaInfo}
          imdbMediaInfo={imdbMediaInfo}
          imdbEpisodes={getImdbEpisodesListWithNoSeasons()}
        />

        <section id={styles.info_container}>
          <div id={styles.description_episodes_related_container}>
            {/* NEXT EPISODE */}
            {isOnMobileScreen == true &&
              mediaInfo.nextAiringEpisode &&
              mediaInfo.format != "MOVIE" && (
                <div id={styles.next_episode_container}>
                  <h2 className={styles.heading_style}>NEXT EPISODE</h2>

                  <p>
                    <span>Episode {mediaInfo.nextAiringEpisode.episode}</span>{" "}
                    on{" "}
                    {convertFromUnix(mediaInfo.nextAiringEpisode.airingAt, {
                      month: "long",
                      year: "numeric",
                      hour: undefined,
                      minute: undefined,
                    })}
                  </p>
                </div>
              )}

            {/* DESCRIPTION */}
            <section id={styles.description_container}>
              <h2 className={styles.heading_style}>DESCRIPTION</h2>

              {mediaInfo.description && (
                <span>{parse(mediaInfo.description) || "Not Available"}</span>
              )}
            </section>

            {/* CAST */}
            {mediaInfo.characters.edges[0] && (
              <section id={styles.cast_container}>
                <h2 className={styles.heading_style}>CAST</h2>

                {/* WHEN HOVERING, FLIP IMAGE AND SHOW THE ACTOR */}
                <div>
                  <ul className="display_flex_row">
                    {mediaInfo.characters.edges.map((character, key) => (
                      <li key={key} data-mediatype={mediaInfo.type}>
                        <div className={styles.character_container}>
                          <div className={styles.img_container}>
                            <Image
                              src={character.node.image.large}
                              alt={character.node.name.full}
                              fill
                              sizes="90px"
                            />
                          </div>

                          <h3>{character.node.name.full}</h3>
                        </div>

                        {/* SHOWS ACTOR ONLY FOR ANIMES  */}
                        {mediaInfo.type == "ANIME" &&
                          character.voiceActorRoles[0] && (
                            <div className={styles.actor_container}>
                              <div className={styles.img_container}>
                                <Image
                                  src={
                                    character.voiceActorRoles[0] &&
                                    character.voiceActorRoles[0].voiceActor
                                      .image.large
                                  }
                                  alt={
                                    `${
                                      character.voiceActorRoles[0] &&
                                      character.voiceActorRoles[0].voiceActor
                                        .name.full
                                    } voiceover for ${
                                      character.node.name.full
                                    }` || "No Name Actor"
                                  }
                                  fill
                                  sizes="90px"
                                />
                              </div>

                              <h3>
                                {character.voiceActorRoles[0] &&
                                  character.voiceActorRoles[0].voiceActor.name
                                    .full}
                              </h3>
                            </div>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* EPISODES - ONLY FOR ANIME */}
            {mediaInfo.type == "ANIME" &&
              mediaInfo.format != "MOVIE" &&
              mediaInfo.status != "NOT_YET_RELEASED" && (
                <section id={styles.episodes_container}>
                  <EpisodesContainer
                    crunchyrollInitialEpisodes={getCrunchyrollEpisodes()}
                    mediaInfo={mediaInfo}
                    episodesWatchedOnAnilist={
                      mediaInfo.mediaListEntry?.progress || undefined
                    }
                    imdb={{
                      mediaSeasons: imdbMediaInfo?.seasons,
                      episodesList: getImdbEpisodesListWithNoSeasons(),
                    }}
                  />
                </section>
              )}

            {/* CHAPTERS - ONLY FOR MANGAS */}
            {mediaInfo.type == "MANGA" && (
              <section>
                <h2 className={styles.heading_style}>CHAPTERS</h2>

                <MangaChaptersContainer
                  mediaInfo={mediaInfo}
                  chaptersReadOnAnilist={
                    mediaInfo.mediaListEntry?.progress || undefined
                  }
                />
              </section>
            )}

            {/* RELATIONED TO THIS MEDIA */}
            {mediaInfo.relations.nodes[0] && (
              <section id={styles.related_container}>
                <div className="display_flex_row space_beetween align_items_center display_wrap">
                  <h2 className={styles.heading_style}>
                    RELATED TO {mediaInfo.title.romaji.toUpperCase()}
                  </h2>
                </div>

                <ul>
                  <MediaRelatedContainer
                    mediaList={mediaInfo.relations.nodes}
                  />
                </ul>
              </section>
            )}

            {/* REVIEWS SECTION */}
            {mediaInfo.reviews?.nodes.length > 0 && (
              <Reviews reviews={mediaInfo.reviews.nodes} />
            )}

            {/* RECOMMENDATIONS ACCORDING TO THIS MEDIA */}
            {mediaInfo.recommendations.edges[0] && (
              <section id={styles.similar_container}>
                <h2 className={styles.heading_style}>
                  SIMILAR {mediaInfo.type.toUpperCase()}S YOU MAY LIKE
                </h2>

                <ul>
                  {mediaInfo?.recommendations.edges
                    .slice(0, 12)
                    .map((media, key) => (
                      <li key={key}>
                        <MediaCard.Container positionIndex={key + 1} onDarkMode>
                          <MediaCard.MediaImgLink
                            mediaInfo={media.node.mediaRecommendation}
                            mediaId={media.node.mediaRecommendation?.id}
                            title={
                              media.node.mediaRecommendation?.title
                                .userPreferred ||
                              media.node.mediaRecommendation?.title.romaji
                            }
                            formatOrType={
                              media.node.mediaRecommendation?.format
                            }
                            url={
                              media.node.mediaRecommendation?.coverImage.large
                            }
                          />

                          <MediaCard.SmallTag
                            seasonYear={
                              media.node.mediaRecommendation?.seasonYear
                            }
                            tags={media.node.mediaRecommendation?.genres[0]}
                          />

                          <MediaCard.LinkTitle
                            title={
                              media.node.mediaRecommendation?.title
                                .userPreferred ||
                              media.node.mediaRecommendation?.title.romaji
                            }
                            id={media.node.mediaRecommendation?.id}
                          />
                        </MediaCard.Container>
                      </li>
                    ))}
                </ul>
              </section>
            )}
          </div>

          <div id={styles.hype_container}>
            {/* NEXT EPISODE */}
            {isOnMobileScreen == false &&
              mediaInfo.nextAiringEpisode &&
              mediaInfo.format != "MOVIE" && (
                <div id={styles.next_episode_container}>
                  <h2 className={styles.heading_style}>NEXT EPISODE</h2>

                  <p>
                    <span>Episode {mediaInfo.nextAiringEpisode.episode}</span>{" "}
                    on{" "}
                    {convertFromUnix(mediaInfo.nextAiringEpisode.airingAt, {
                      month: "long",
                      year: "numeric",
                      hour: undefined,
                      minute: undefined,
                    })}
                  </p>
                </div>
              )}

            {/* SCORE */}
            {(mediaInfo.averageScore || imdbMediaInfo?.rating != 0) && (
              <div id={styles.score_container}>
                <h2 className={styles.heading_style}>SCORE</h2>

                <ul>
                  {mediaInfo.averageScore && (
                    <li className="display_flex_row align_items_center">
                      <ScoreRating
                        ratingScore={mediaInfo.averageScore / 2 / 10}
                        source="anilist"
                      />

                      <span style={{ marginLeft: "64px" }}>
                        {`(${mediaInfo.averageScore / 2 / 10}/5)`}
                      </span>
                    </li>
                  )}

                  {imdbMediaInfo?.rating != 0 &&
                    imdbMediaInfo?.rating != null && (
                      <li className="display_flex_row align_items_center">
                        <ScoreRating
                          ratingScore={Number(imdbMediaInfo.rating.toFixed(1))}
                          source="imdb"
                          ratingType="string"
                        />
                      </li>
                    )}
                </ul>
              </div>
            )}

            {/* TRAILER */}
            {mediaInfo.trailer && (
              <div id={styles.yt_video_container}>
                <h2 className={styles.heading_style}>TRAILER</h2>
                <iframe
                  className="yt_embed_video"
                  src={`https://www.youtube.com/embed/${mediaInfo.trailer.id}`}
                  frameBorder={0}
                  title={mediaInfo.title.romaji + " Trailer"}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                  allowFullScreen
                />
              </div>
            )}

            <div id={styles.more_info_container}>
              <h2 className={styles.heading_style}>MORE INFO</h2>

              <ul>
                {mediaInfo.endDate?.year && (
                  <li>
                    <p>
                      Ended in
                      <span>
                        {getMediaReleaseDate(
                          mediaInfo.startDate ? mediaInfo.endDate : undefined
                        )}
                      </span>
                    </p>
                  </li>
                )}

                {mediaInfo.studios?.edges[0]?.node && (
                  <li>
                    <p>
                      Main Studio{" "}
                      <span className={styles.color_brand}>
                        {mediaInfo.studios.edges[0].node.name}
                      </span>
                    </p>
                  </li>
                )}

                {mediaInfo.trending != 0 && (
                  <li>
                    <p>
                      Trending Level{" "}
                      <span className={styles.color_brand}>
                        {mediaInfo.trending}
                      </span>
                    </p>
                  </li>
                )}

                {mediaInfo.favourites && (
                  <li>
                    <p>
                      Favorited by{" "}
                      <span>
                        <span className={styles.color_brand}>
                          {mediaInfo.favourites.toLocaleString("en-US")}
                        </span>{" "}
                        {mediaInfo.favourites == 1 ? "User" : "Users"}
                      </span>
                    </p>
                  </li>
                )}

                {mediaInfo.hashtag && (
                  <li>
                    <p>
                      Hashtag{" "}
                      <span className={styles.color_brand}>
                        {mediaInfo.hashtag.toUpperCase()}
                      </span>
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
