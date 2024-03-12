import { ApiDefaultResult, ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import React from 'react'
import API from "@/api/anilist"
import styles from "./page.module.css"
import Link from 'next/link'
import Image from 'next/image'
import parse from "html-react-parser"
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import BookmarkFillSvg from "@/public/assets/bookmark-check-fill.svg"
import PlaySvg from "@/public/assets/play-circle.svg"
import BookSvg from "@/public/assets/book.svg"
import CalendarSvg from "@/public/assets/calendar3.svg"
import ClockSvg from "@/public/assets/clock.svg"
import ProgressSvg from "@/public/assets/progress.svg"
import BookmarkSvg from "@/public/assets/bookmark-plus.svg"
import AnilistSvg from "@/public/assets/anilist.svg"
import SwipeSvg from "@/public/assets/swipe.svg"
import EpisodesContainer from './components/AnimeEpisodesContainer'
import MangaChaptersContainer from './components/MangaChaptersContainer'
import AddToPlaylistButton from '@/app/components/AddToPlaylistButton'
import ScoreInStars from '@/app/components/ScoreInStars'
import PlayBtn from './components/WatchPlayBtn'
import SwiperListContainer from '@/app/components/SwiperListContainer'
import { headers } from 'next/headers'
import { checkDeviceIsMobile } from '@/app/lib/checkMobileOrDesktop'
import { convertFromUnix } from '@/app/lib/formatDateUnix'
import CommentSectionContainer from '../../components/CommentSectionContainer'

export async function generateMetadata({ params }: { params: { id: number } }) {

  const mediaData = await API.getMediaInfo(params.id) as ApiMediaResults

  return {
    title: `${mediaData.title.romaji || mediaData.title.native} | AniProject`,
    description: mediaData.description || `See more info about ${mediaData.title.romaji || mediaData.title.native}`,
  }
}

async function MediaPage({ params }: { params: { id: number } }) {

  const mediaData = await API.getMediaInfo(params.id) as ApiMediaResults

  const isMobileScreen = checkDeviceIsMobile(headers()) || false

  return (
    <main id={styles.container}>

      {/* BANNER or BACKGROUND COLOR*/}
      <div
        id={styles.banner_background_container}
        style={{
          background: isMobileScreen ?
            `linear-gradient(rgba(0, 0, 0, 0.05), #181818 100%), url(${mediaData?.coverImage?.extraLarge})`
            :
            `linear-gradient(rgba(0, 0, 0, 0.05), #181818 100%), url(${mediaData.bannerImage})`
        }}
      >
      </div>

      {/* MEDIA INFO */}
      <div id={styles.media_info_container}>

        <section id={styles.media_title_container}>

          {mediaData.title.romaji && (<small>{mediaData.title.native}</small>)}
          {mediaData.title.romaji ? (
            <h1>{(mediaData.title.romaji).toUpperCase()}</h1>
          ) : (
            <h1>{mediaData.title.native}</h1>
          )}

          <div id={styles.genres_and_type_container} className='display_flex_row'>

            <div className='display_flex_row align_items_center'>
              {mediaData.genres && (
                <ul className='display_flex_row'>
                  {mediaData.genres.slice(0, 3).map((item, key: number) => (
                    <li key={key}>
                      <Link href={`/search?genre=[${item.toLowerCase()}]`}>{item}</Link>
                    </li>
                  ))}
                </ul>
              )}
              {mediaData.format && (
                <span style={{ color: mediaData.coverImage?.color || "var(--white-100)" }}>{(mediaData.format == "TV" ? "anime" : mediaData.format).toUpperCase()}</span>
              )}
            </div>

            <div id={styles.add_playlist_container}>
              <AddToPlaylistButton
                data={mediaData as ApiDefaultResult}
                customText={
                  [<BookmarkFillSvg key={0} />, <BookmarkSvg key={1} />]
                }
              />
            </div>

          </div>

        </section>

        {/* GENERAL INFO */}
        <section id={styles.info_list_container}>

          <ul>
            {(mediaData.type != "MANGA") && (
              <li className={`${styles.info_item} ${styles.action_btn}`}>

                <PlayBtn mediaId={mediaData.id} mediaTitle={mediaData.title.romaji} />

              </li>
            )}

            {(mediaData.format == "MOVIE") ? (
              <li className={`${styles.info_item}`}>

                <h2>SOURCE</h2>

                <p>{mediaData.source.toUpperCase() || "Not Available"}</p>

              </li>
            ) : (
              <li className={`${styles.info_item}`}>

                <span>
                  <ProgressSvg width={16} height={16} alt="Progress" />
                </span>

                <h2>STATUS</h2>

                <p>{mediaData.status == "NOT_YET_RELEASED" ? "TO BE RELEASED" : mediaData.status || "Not Available"}</p>

              </li>
            )}

            {(mediaData.type == "ANIME" && mediaData.format != "MOVIE") && (
              <li className={`${styles.info_item}`}>

                <span>
                  <PlaySvg width={16} height={16} alt="Episodes" />
                </span>

                <h2>EPISODES</h2>

                <p>{mediaData.episodes || "Not Available"}</p>
              </li>
            )}

            {mediaData.type == "MANGA" && (
              <li className={`${styles.info_item}`}>

                <span>
                  <BookSvg width={16} height={16} alt="Volumes" />
                </span>

                <h2>VOLUMES</h2>

                <p>{mediaData.volumes || "Not Available"}</p>
              </li>
            )}

            <li className={`${styles.info_item}`}>

              <span>
                <CalendarSvg width={16} height={16} alt="Release" />
              </span>

              <h2>RELEASE</h2>

              <p className={styles.width_min_content}>
                {mediaData.startDate &&
                  new Date(Date.parse(
                    `${mediaData.startDate.month} ${mediaData.startDate.day} ${mediaData.startDate.year}`
                  )).toLocaleString('en-US', { month: 'long', day: "numeric", year: "numeric" })
                  ||
                  "Not Available"}
              </p>

            </li>

            <li className={`${styles.info_item}`}>

              {mediaData.type == "ANIME" && (<>

                <span>
                  <ClockSvg width={16} height={16} alt="Length" />
                </span>

                <h2>LENTGH</h2>

                <p>{mediaData.duration == null ? "Not Available" : `${mediaData.duration} min` || "Not Available"}</p>
              </>
              )}

              {mediaData.type == "MANGA" && (<>

                <span>
                  <BookSvg width={16} height={16} alt="Chapters" />
                </span>

                <h2>CHAPTERS</h2>

                <p>{mediaData.chapters || "Not Available"}</p>
              </>
              )}
            </li>

          </ul>

        </section>

        <section id={styles.info_container}>

          <div id={styles.description_episodes_related_container}>

            {/* NEXT EPISODE */}
            {(isMobileScreen == true && mediaData.nextAiringEpisode && mediaData.format != "MOVIE") && (
              <div id={styles.next_episode_container}>

                <h2 className={styles.heading_style}>
                  NEXT EPISODE
                </h2>

                <p>
                  <span>Episode {mediaData.nextAiringEpisode.episode}</span> on {convertFromUnix(mediaData.nextAiringEpisode.airingAt)}
                </p>

              </div>
            )}

            {/* DESCRIPTION */}
            <section id={styles.description_container}>
              <h2 className={styles.heading_style}>DESCRIPTION</h2>

              {mediaData.description && (
                <span>{parse(mediaData.description) || "Not Available"}</span>
              )}
            </section>

            {/* CAST */}
            {mediaData.characters.edges[0] && (
              <section id={styles.cast_container}>

                <h2 className={styles.heading_style}>CAST</h2>

                {mediaData.type == "ANIME" && (
                  <p>Hover over the image to show the actor behind its character</p>
                )}

                {/* MAKE HOVER, THAN FLIP IMAGE AND SHOW THE ACTOR */}
                <div>
                  <ul className='display_flex_row'>
                    {mediaData.characters.edges.map((item, key: number) => (

                      <li key={key} data-mediatype={mediaData.type}>

                        <div className={styles.character_container}>
                          <div className={styles.img_container}>
                            <Image
                              src={item.node.image.large}
                              alt={item.node.name.full}
                              sizes='100%'
                              fill
                            ></Image>
                          </div>
                          <h3>
                            <Link href={`/character/${item.id}`}>
                              {item.node.name.full}
                            </Link>
                          </h3>
                        </div>

                        {/* SHOWS ONLY FOR ANIMES  */}
                        {mediaData.type == "ANIME" && (

                          <div className={styles.actor_container}>
                            <div className={styles.img_container}>
                              <Image
                                src={item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.image.large}
                                alt={(`${item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.name.full} voiceover for ${item.node.name.full}`) || "No Name Actor"}
                                sizes='100%'
                                fill
                              ></Image>
                            </div>
                            <h3>
                              <Link href={`/actor/${item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.id}`}>
                                {item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.name.full}
                              </Link>
                            </h3>
                          </div>
                        )}

                      </li>
                    ))}

                  </ul>
                </div>

              </section>
            )}

            {/* EPISODES ONLY IF ANIME */}
            {(mediaData.type == "ANIME" && mediaData.format != "MOVIE") && (
              <section id={styles.episodes_container}>

                <h2 className={styles.heading_style}>EPISODES</h2>

                <EpisodesContainer
                  data={mediaData.streamingEpisodes}
                  mediaTitle={mediaData.title.romaji}
                  mediaId={mediaData.id}
                  totalEpisodes={mediaData.nextAiringEpisode ?
                    mediaData.nextAiringEpisode.episode - 1 : mediaData.episodes // work around to api gogoanime not showing episodes
                  }
                />

              </section>
            )}

            {/* CHAPTERS ONLY IF MANGA */}
            {mediaData.type == "MANGA" && (
              <section>

                <h2 className={styles.heading_style}>CHAPTERS</h2>

                <MangaChaptersContainer mangaTitle={mediaData.title.romaji} />

              </section>
            )}

            {/* RELATIONED TO THIS MEDIA */}
            {mediaData.relations.nodes[0] && (
              <section id={styles.related_container}>

                <div className='display_flex_row space_beetween align_items_center display_wrap'>
                  <h2 className={styles.heading_style}>RELATED TO {(mediaData.title.romaji).toUpperCase()}</h2>
                </div>

                <ul>

                  <SwiperListContainer data={(mediaData).relations.nodes} />

                </ul>

              </section>
            )}

            {/* COMMENTS SECTION */}
            <section id={styles.comments_container}>

              <h2 className={styles.heading_style}>COMMENTS</h2>

              <CommentSectionContainer media={mediaData} />

            </section>

            {/* RECOMMENDATIONS ACCORDING TO THIS MEDIA */}
            {mediaData.recommendations.edges[0] && (
              <section id={styles.similar_container}>

                <h2 className={styles.heading_style}>SIMILAR {(mediaData.type).toUpperCase()}S YOU MAY LIKE</h2>

                <ul>

                  {mediaData?.recommendations.edges.slice(0, 12).map((item, key: number) => (

                    <li key={key} >
                      <MediaItemCoverInfo positionIndex={key + 1} darkMode={true} data={item.node.mediaRecommendation} />
                    </li>

                  ))}

                </ul>

              </section>
            )}

          </div>

          <div id={styles.hype_container}>

            {/* NEXT EPISODE */}
            {(isMobileScreen == false && mediaData.nextAiringEpisode && mediaData.format != "MOVIE") && (
              <div id={styles.next_episode_container}>

                <h2 className={styles.heading_style}>
                  NEXT EPISODE
                </h2>

                <p>
                  <span>Episode {mediaData.nextAiringEpisode.episode}</span> on {convertFromUnix(mediaData.nextAiringEpisode.airingAt)}
                </p>

              </div>
            )}

            {mediaData.averageScore && (
              <div id={styles.score_container}>
                <h2 className={styles.heading_style}>
                  SCORE
                </h2>

                <ul>

                  <li className='display_flex_row align_items_center'>
                    <span>
                      <AnilistSvg fill={"#02a9ff"} width={32} height={32} alt={"Anilist Icon"} title={'Anilist'} /> Anilist
                    </span>
                    <ScoreInStars score={(mediaData.averageScore / 2) / 10} />
                    <span>
                      {`(${(mediaData.averageScore / 2) / 10}/5)`}
                    </span>
                  </li>

                </ul>
              </div>
            )}

            {(mediaData.trailer) && (
              <div id={styles.yt_video_container}>
                <h2 className={styles.heading_style}>TRAILER</h2>
                <iframe
                  className="yt_embed_video"
                  src={`https://www.youtube.com/embed/${mediaData.trailer.id}`}
                  frameBorder={0}
                  title={mediaData.title.romaji + " Trailer"}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                  allowFullScreen></iframe>
              </div>
            )}

            <div id={styles.more_info_container}>

              <h2 className={styles.heading_style}>MORE INFO</h2>

              <ul>

                {mediaData.studios?.edges[0]?.node && (
                  <li>
                    <p>Main Studio <span className={styles.color_brand}>{mediaData.studios.edges[0].node.name}</span></p>
                  </li>
                )}

                {mediaData.trending != 0 && (
                  <li>
                    <p>Trending Level <span className={styles.color_brand}>{mediaData.trending}</span></p>
                  </li>
                )}

                {mediaData.favourites && (
                  <li>
                    <p>Favorited by <span><span className={styles.color_brand}>{mediaData.favourites.toLocaleString("en-US")}</span> {mediaData.favourites == 1 ? "User" : "Users"}</span></p>
                  </li>
                )}

                {mediaData.hashtag && (
                  <li>
                    <p>Hashtag <span className={styles.color_brand}>{mediaData.hashtag.toUpperCase()}</span></p>
                  </li>
                )}

              </ul>

            </div>

          </div>

        </section>

      </div >

    </main >
  )
}

export default MediaPage