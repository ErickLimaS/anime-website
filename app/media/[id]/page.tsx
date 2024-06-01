import { ApiDefaultResult, ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import React from 'react'
import anilist from "@/app/api/anilist"
import styles from "./page.module.css"
import Link from 'next/link'
import Image from 'next/image'
import parse from "html-react-parser"
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import BookmarkFillSvg from "@/public/assets/bookmark-check-fill.svg"
import PlaySvg from "@/public/assets/play-circle.svg"
import BookSvg from "@/public/assets/book.svg"
import CalendarSvg from "@/public/assets/calendar3.svg"
import ClockSvg from "@/public/assets/clock.svg"
import ProgressSvg from "@/public/assets/progress.svg"
import BookmarkSvg from "@/public/assets/bookmark-plus.svg"
import EpisodesContainer from './components/AnimeEpisodesContainer'
import MangaChaptersContainer from './components/MangaChaptersContainer'
import * as AddToPlaylist from '@/app/components/Buttons/AddToPlaylist'
import ScoreRating from '@/app/components/DynamicAssets/ScoreRating'
import PlayBtn from './components/WatchPlayBtn'
import { headers } from 'next/headers'
import { checkDeviceIsMobile } from '@/app/lib/checkMobileOrDesktop'
import { convertFromUnix } from '@/app/lib/formatDateUnix'
import CommentsSection from '../../components/CommentsSection'
import { getMediaInfo } from '@/app/api/consumetImdb'
import { ImdbEpisode, ImdbMediaInfo } from '@/app/ts/interfaces/apiImdbInterface'
import MediaRelatedContainer from './components/MediaRelatedContainer'
import AddToNotificationsButton from '@/app/components/Buttons/AddToNotificationsButton'

export const revalidate = 43200 // revalidate cached data every 12 hours

export async function generateMetadata({ params }: { params: { id: number } }) {

  const mediaData = await anilist.getMediaInfo({ id: params.id }) as ApiMediaResults

  return {
    title: `${mediaData.title.romaji || mediaData.title.native} | AniProject`,
    description: mediaData.description || `See more info about ${mediaData.title.romaji || mediaData.title.native}`,
  }

}

async function MediaPage({ params }: { params: { id: number } }) {

  const mediaInfo = await anilist.getMediaInfo({ id: params.id }) as ApiMediaResults

  const isOnMobileScreen = checkDeviceIsMobile(headers()) || false

  // GET MEDIA INFO ON IMDB
  const imdbMediaInfo = await getMediaInfo({ search: true, seachTitle: mediaInfo.title.romaji, releaseYear: mediaInfo.startDate.year }) as ImdbMediaInfo

  function getCrunchyrollEpisodes() {

    const episodesFromCrunchyroll = mediaInfo.streamingEpisodes?.sort((a, b) => {
      const numA = Number(a.title.slice(a.title?.search(/\b \b/), a.title?.search(/\b - \b/)))
      const numB = Number(b.title.slice(b.title?.search(/\b \b/), b.title?.search(/\b - \b/)))

      return numA - numB

    })

    return episodesFromCrunchyroll

  }

  // GET MEDIA EPISODES ON IMDB
  function getImdbEpisodesListWithNoSeasons() {

    let imdbEpisodesMapped: ImdbEpisode[] = []

    imdbMediaInfo?.seasons?.map(
      itemA => itemA.episodes?.map(
        itemB => imdbEpisodesMapped.push(itemB))

    )

    return imdbEpisodesMapped

  }

  function randomizeBcgImg() {

    const backgroundImgs: { url: string }[] = []

    if (mediaInfo?.bannerImage) backgroundImgs.push({ url: mediaInfo?.bannerImage })
    if (imdbMediaInfo?.cover) backgroundImgs.push({ url: imdbMediaInfo?.cover })

    const randomNumber = Math.floor(Math.random() * (backgroundImgs?.length))

    return backgroundImgs[randomNumber]?.url

  }

  function convertMediaStatus() {

    if (mediaInfo.status == "NOT_YET_RELEASED") {
      return "TO BE RELEASED"
    }
    else if (mediaInfo.status == "FINISHED") {
      return "COMPLETE"

    }

    return mediaInfo.status || "Not Available"

  }

  function getEpisodesQuantity() {

    const imdbEpisodes = getImdbEpisodesListWithNoSeasons()

    return imdbEpisodes.length || mediaInfo.episodes || "Not Available"
  }

  function bcgImgBasedOnScreenDisplay() {

    if (isOnMobileScreen) {
      return `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${mediaInfo?.coverImage?.extraLarge})`
    }
    else {
      return `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${mediaInfo.format == "MANGA" ?
        mediaInfo.bannerImage : randomizeBcgImg()})`
    }
  }

  function getDate(date: { month: number, day: number, year: number }) {

    if (mediaInfo.startDate) {

      return new Date(Date.parse(`${date.month} ${date.day} ${date.year}`)).
        toLocaleString('en-US', { month: 'long', day: "numeric", year: "numeric" })

    }

    return "Not Available"

  }

  return (
    <main id={styles.container}>

      {/* BANNER or BACKGROUND COLOR*/}
      <div
        id={styles.banner_background_container}
        style={{ background: bcgImgBasedOnScreenDisplay() }}
      >
      </div>

      <div id={styles.media_info_container} className={(imdbMediaInfo?.logos && imdbMediaInfo?.logos[0]) ? `${styles.custom_position}` : ``}>

        <section id={styles.media_title_container}>
          {(imdbMediaInfo && imdbMediaInfo?.logos.length > 0) ? (
            <h1>
              {(mediaInfo.title?.romaji).toUpperCase() || mediaInfo.title.native}
            </h1>
          ) : (
            <small>
              {mediaInfo.title.native}
            </small>
          )}

          {(imdbMediaInfo?.logos.length > 0) ? (
            <div
              className={styles.heading_img_container}
              style={{ aspectRatio: imdbMediaInfo.logos[0]?.aspectRatio }}
            >
              <Image
                src={imdbMediaInfo.logos[0]?.url}
                alt={mediaInfo.title.romaji}
                fill
                sizes='(max-width: 520px) 100%, 280px'
              />
            </div>
          ) : (
            <h1 id={styles.heading_title}>
              {(mediaInfo.title?.romaji).toUpperCase()}
            </h1>
          )}

          <div id={styles.genres_and_type_container} className='display_flex_row align_items_center'>

            <div className='display_flex_row align_items_center'>

              {mediaInfo.genres && (
                <ul>
                  {mediaInfo.genres.slice(0, 3).map((genre, key) => (
                    <li key={key}>
                      <Link href={`/search?genre=[${genre.toLowerCase()}]`}>
                        {genre}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {mediaInfo.format && (
                <span style={{ color: mediaInfo.coverImage?.color || "var(--white-100)" }}>
                  {(mediaInfo.format == "TV" ? "anime" : mediaInfo.format).toUpperCase()}
                </span>
              )}

            </div>

            <div id={styles.btns_actions_container}>

              <AddToNotificationsButton
                mediaInfo={mediaInfo}
              />

              <AddToPlaylist.Button
                mediaInfo={mediaInfo as ApiDefaultResult}
              >

                <AddToPlaylist.SvgIcon>
                  <BookmarkSvg />
                </AddToPlaylist.SvgIcon>

                <AddToPlaylist.SvgIcon>
                  <BookmarkFillSvg />
                </AddToPlaylist.SvgIcon>

              </AddToPlaylist.Button>

            </div>

          </div>

        </section>

        {/* GENERAL INFO */}
        <section id={styles.info_list_container}>

          <ul>
            {(mediaInfo.type != "MANGA") && (
              <li className={`${styles.info_item} ${styles.action_btn}`}>

                <PlayBtn
                  mediaId={mediaInfo.id}
                  mediaTitle={mediaInfo.title.romaji}
                />

              </li>
            )}

            {(mediaInfo.format == "MOVIE") ? (
              <li className={`${styles.info_item}`}>

                <h2>SOURCE</h2>

                <p>
                  {mediaInfo.source.toUpperCase() || "Not Available"}
                </p>

              </li>
            ) : (
              <li className={`${styles.info_item}`}>

                <span>
                  <ProgressSvg width={16} height={16} alt="Progress" />
                </span>

                <h2>STATUS</h2>

                <p>
                  {convertMediaStatus()}
                </p>

              </li>
            )}

            {(mediaInfo.type == "ANIME" && mediaInfo.format != "MOVIE" && mediaInfo.status != "NOT_YET_RELEASED") && (
              <li className={`${styles.info_item}`}>

                <span>
                  <PlaySvg width={16} height={16} alt="Episodes" />
                </span>

                <h2>EPISODES</h2>

                <p>
                  {getEpisodesQuantity()}
                </p>

              </li>
            )}

            {mediaInfo.type == "MANGA" && (
              <li className={`${styles.info_item}`}>

                <span>
                  <BookSvg width={16} height={16} alt="Volumes" />
                </span>

                <h2>VOLUMES</h2>

                <p>
                  {mediaInfo.volumes || "Not Available"}
                </p>

              </li>
            )}

            <li className={`${styles.info_item}`}>

              <span>
                <CalendarSvg width={16} height={16} alt="Release" />
              </span>

              <h2>RELEASE</h2>

              <p className={styles.width_min_content}>
                {getDate(mediaInfo.startDate)}
              </p>

            </li>

            <li className={`${styles.info_item}`}>

              {mediaInfo.type == "ANIME" && (
                <React.Fragment>

                  <span>
                    <ClockSvg width={16} height={16} alt="Length" />
                  </span>

                  <h2>LENGTH</h2>

                  <p>
                    {mediaInfo.duration == null ? "Not Available" : `${mediaInfo.duration} min` || "Not Available"}
                  </p>

                </React.Fragment>
              )}

              {mediaInfo.type == "MANGA" && (
                <React.Fragment>

                  <span>
                    <BookSvg width={16} height={16} alt="Chapters" />
                  </span>

                  <h2>CHAPTERS</h2>

                  <p>{mediaInfo.chapters || "Not Available"}</p>
                </React.Fragment>
              )}

            </li>

          </ul>

        </section>

        <section id={styles.info_container}>

          <div id={styles.description_episodes_related_container}>

            {/* NEXT EPISODE */}
            {(isOnMobileScreen == true && mediaInfo.nextAiringEpisode && mediaInfo.format != "MOVIE") && (
              <div id={styles.next_episode_container}>

                <h2 className={styles.heading_style}>
                  NEXT EPISODE
                </h2>

                <p>
                  <span>Episode {mediaInfo.nextAiringEpisode.episode}</span> on {convertFromUnix(mediaInfo.nextAiringEpisode.airingAt, { month: 'long', year: 'numeric', hour: undefined, minute: undefined })}
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
                  <ul className='display_flex_row'>
                    {mediaInfo.characters.edges.map((character, key) => (

                      <li key={key} data-mediatype={mediaInfo.type}>

                        <div className={styles.character_container}>

                          <div className={styles.img_container}>
                            <Image
                              src={character.node.image.large}
                              alt={character.node.name.full}
                              fill
                              sizes='90px'
                            />
                          </div>

                          <h3>{character.node.name.full}</h3>

                        </div>

                        {/* SHOWS ACTOR ONLY FOR ANIMES  */}
                        {(mediaInfo.type == "ANIME" && character.voiceActorRoles[0]) && (

                          <div className={styles.actor_container}>

                            <div className={styles.img_container}>
                              <Image
                                src={character.voiceActorRoles[0] && character.voiceActorRoles[0].voiceActor.image.large}
                                alt={(`${character.voiceActorRoles[0] && character.voiceActorRoles[0].voiceActor.name.full} voiceover for ${character.node.name.full}`) || "No Name Actor"}
                                fill
                                sizes='90px'
                              />
                            </div>

                            <h3>{character.voiceActorRoles[0] && character.voiceActorRoles[0].voiceActor.name.full}</h3>

                          </div>
                        )}

                      </li>
                    ))}

                  </ul>
                </div>

              </section>
            )}

            {/* EPISODES - ONLY FOR ANIME */}
            {(mediaInfo.type == "ANIME" && mediaInfo.format != "MOVIE" && mediaInfo.status != "NOT_YET_RELEASED") && (
              <section id={styles.episodes_container}>

                <EpisodesContainer
                  crunchyrollInitialEpisodes={getCrunchyrollEpisodes()}
                  mediaInfo={mediaInfo}
                  imdb={{
                    mediaSeasons: imdbMediaInfo?.seasons,
                    episodesList: getImdbEpisodesListWithNoSeasons()
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
                />

              </section>
            )}

            {/* RELATIONED TO THIS MEDIA */}
            {mediaInfo.relations.nodes[0] && (
              <section id={styles.related_container}>

                <div className='display_flex_row space_beetween align_items_center display_wrap'>
                  <h2 className={styles.heading_style}>RELATED TO {(mediaInfo.title.romaji).toUpperCase()}</h2>
                </div>

                <ul>

                  <MediaRelatedContainer
                    mediaList={mediaInfo.relations.nodes}
                  />

                </ul>

              </section>
            )}

            {/* COMMENTS SECTION */}
            <section id={styles.comments_container}>

              <h2 className={styles.heading_style}>COMMENTS</h2>

              <CommentsSection
                mediaInfo={mediaInfo}
              />

            </section>

            {/* RECOMMENDATIONS ACCORDING TO THIS MEDIA */}
            {mediaInfo.recommendations.edges[0] && (
              <section id={styles.similar_container}>

                <h2 className={styles.heading_style}>SIMILAR {(mediaInfo.type).toUpperCase()}S YOU MAY LIKE</h2>

                <ul>

                  {mediaInfo?.recommendations.edges.slice(0, 12).map((media, key) => (

                    <li key={key}>

                      <MediaCard.Container positionIndex={key + 1} onDarkMode>

                        <MediaCard.MediaImgLink
                          mediaId={media.node.mediaRecommendation.id}
                          title={media.node.mediaRecommendation.title.romaji || media.node.mediaRecommendation.title.native}
                          formatOrType={media.node.mediaRecommendation.format}
                          url={media.node.mediaRecommendation.coverImage.large}
                        />

                        <MediaCard.SmallTag
                          seasonYear={media.node.mediaRecommendation.seasonYear}
                          tags={media.node.mediaRecommendation.genres[0]}
                        />

                        <MediaCard.LinkTitle
                          title={media.node.mediaRecommendation.title.romaji || media.node.mediaRecommendation.title.native}
                          id={media.node.mediaRecommendation.id}
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
            {(isOnMobileScreen == false && mediaInfo.nextAiringEpisode && mediaInfo.format != "MOVIE") && (
              <div id={styles.next_episode_container}>

                <h2 className={styles.heading_style}>
                  NEXT EPISODE
                </h2>

                <p>
                  <span>Episode {mediaInfo.nextAiringEpisode.episode}</span> on {convertFromUnix(mediaInfo.nextAiringEpisode.airingAt, { month: 'long', year: 'numeric', hour: undefined, minute: undefined })}
                </p>

              </div>
            )}

            {/* SCORE */}
            {(mediaInfo.averageScore || imdbMediaInfo?.rating != 0) && (
              <div id={styles.score_container}>
                <h2 className={styles.heading_style}>
                  SCORE
                </h2>

                <ul>

                  {mediaInfo.averageScore && (
                    <li className='display_flex_row align_items_center'>

                      <ScoreRating
                        ratingScore={(mediaInfo.averageScore / 2) / 10}
                        source='anilist'
                      />

                      <span style={{ marginLeft: "64px" }}>
                        {`(${(mediaInfo.averageScore / 2) / 10}/5)`}
                      </span>

                    </li>
                  )}

                  {(imdbMediaInfo?.rating != 0 && imdbMediaInfo?.rating != null) && (
                    <li className='display_flex_row align_items_center'>

                      <ScoreRating
                        ratingScore={Number(imdbMediaInfo.rating.toFixed(1))}
                        source='imdb'
                        ratingType='string'
                      />

                    </li>
                  )}

                </ul>
              </div>
            )}

            {/* TRAILER */}
            {(mediaInfo.trailer) && (
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
                    <p>Ended in
                      <span>
                        {getDate(mediaInfo.endDate)}
                      </span>
                    </p>
                  </li>
                )}

                {mediaInfo.studios?.edges[0]?.node && (
                  <li>
                    <p>Main Studio <span className={styles.color_brand}>{mediaInfo.studios.edges[0].node.name}</span></p>
                  </li>
                )}

                {mediaInfo.trending != 0 && (
                  <li>
                    <p>Trending Level <span className={styles.color_brand}>{mediaInfo.trending}</span></p>
                  </li>
                )}

                {mediaInfo.favourites && (
                  <li>
                    <p>Favorited by <span><span className={styles.color_brand}>
                      {mediaInfo.favourites.toLocaleString("en-US")}</span> {mediaInfo.favourites == 1 ? "User" : "Users"}</span>
                    </p>
                  </li>
                )}

                {mediaInfo.hashtag && (
                  <li>
                    <p>Hashtag <span className={styles.color_brand}>{mediaInfo.hashtag.toUpperCase()}</span></p>
                  </li>
                )}

              </ul>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}

export default MediaPage