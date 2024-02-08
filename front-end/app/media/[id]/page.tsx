import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'
import React from 'react'
import API from "@/api/anilist"
import styles from "./page.module.css"
import Link from 'next/link'
import Image from 'next/image'
import parse from "html-react-parser"
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import ChevonRightSvg from "@/public/assets/chevron-right.svg"
import EpisodesContainer from '@/app/components/AnimeEpisodesContainer'
import MangaChaptersContainer from '@/app/components/MangaChaptersContainer'

export async function generateMetadata({ params }: { params: { id: number } }) {

  const mediaData = await API.getMediaInfo(params.id) as ApiMediaResults

  return {
    title: `${mediaData.title.romaji || mediaData.title.native} | AniProject`,
    description: mediaData.description || `See more info about ${mediaData.title.romaji || mediaData.title.native}`,
  }
}

async function MediaPage({ params }: { params: { id: number } }) {

  const mediaData = await API.getMediaInfo(params.id) as ApiMediaResults

  // function scrollHeroSection() {

  //   if (typeof window !== "undefined") {
  //     let isDragging = false;

  //     let startPosition = 0;
  //     let currentTranslate = 0;

  //     let currentListIndex = 1

  //     const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  //     let wasDraggedMoreThanOneThirdScreen = false

  //     const carousel = document.getElementById(`carousel`) as HTMLElement;

  //     if (carousel) {

  //       carousel.addEventListener('mousedown', (e) => {
  //         isDragging = true;
  //         startPosition = e.clientX - currentTranslate;
  //       });

  //       carousel.addEventListener('mouseup', (e) => {
  //         isDragging = false;
  //         currentTranslate = vw - (vw * (currentListIndex + 1))
  //         const newPosition = e.clientX - (startPosition - currentTranslate)

  //         currentTranslate = newPosition - vw;

  //         if (wasDraggedMoreThanOneThirdScreen) {
  //           transitionBeetweenItens()
  //         }

  //       });

  //       carousel.addEventListener('mousemove', (e) => {
  //         if (!isDragging) return;

  //         const newPosition = currentListIndex > 1 ? (e.clientX - (vw * currentListIndex)) : (e.clientX - startPosition)

  //         currentTranslate = newPosition;

  //         if ((currentListIndex + 1) == data.length) return

  //         updateCarousel();

  //         if (currentTranslate + (vw * 1.25)) {
  //           wasDraggedMoreThanOneThirdScreen = true
  //         }

  //       });
  //     }

  //     const updateCarousel = () => {
  //       carousel.style.transform = `translateX(${currentTranslate}px)`;
  //     }

  //     const transitionBeetweenItens = () => {

  //       carousel.style.transform = `translateX(${(vw - (vw * (currentListIndex + 1)))}px)`;
  //       currentListIndex++
  //       currentTranslate = 0
  //       wasDraggedMoreThanOneThirdScreen = false

  //     }

  //   }
  // }

  return (
    <div id={styles.container}>

      {/* BANNER or BACKGROUND COLOR*/}
      <div id={styles.banner_background_container} style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.05), #181818 100%), url(${mediaData && mediaData.bannerImage})`
      }}></div>

      {/* MEDIA INFO */}
      <div id={styles.media_info_container}>

        <section id={styles.media_title_container}>

          {mediaData.title.romaji && (<small>{mediaData.title.native}</small>)}
          {mediaData.title.romaji ? (
            <h1>{(mediaData.title.romaji).toUpperCase()}</h1>
          ) : (
            <h1>{mediaData.title.native}</h1>
          )}

          <div id={styles.genres_and_type_container} className='display_flex_row align_items_center'>
            {mediaData.genres && (
              <ul className='display_flex_row'>
                {mediaData.genres.slice(0, 3).map((item, key: number) => (
                  <li key={key}>
                    <Link href={item.toLowerCase()}>{item}</Link>
                  </li>
                ))}
              </ul>
            )}
            {mediaData.type && (
              <span>{mediaData.type.toUpperCase()}</span>
            )}
          </div>

        </section>

        {/* GENERAL INFO */}
        <section id={styles.info_list_container}>

          <ul >

            <li className={`${styles.info_item}`}>

              <h2>STATUS</h2>

              <p>{mediaData.status == "NOT_YET_RELEASED" ? "TO BE RELEASED" : mediaData.status || "Not Available"}</p>

            </li>

            <li className={`${styles.info_item}`}>

              {mediaData.type == "ANIME" && (<>
                <h2>EPISODES</h2>

                <p>{mediaData.episodes || "Not Available"}</p>
              </>
              )}

              {mediaData.type == "MANGA" && (<>
                <h2>VOLUMES</h2>

                <p>{mediaData.volumes || "Not Available"}</p>
              </>
              )}

            </li>

            <li className={`${styles.info_item}`}>

              <h2>RELEASE</h2>

              <p>{mediaData.seasonYear || "Not Available"}</p>

            </li>

            <li className={`${styles.info_item}`}>

              {mediaData.type == "ANIME" && (<>
                <h2>LENTGH</h2>

                <p>{mediaData.duration == null ? "Not Available" : `${mediaData.duration} min` || "Not Available"}</p>
              </>
              )}

              {mediaData.type == "MANGA" && (<>
                <h2>CHAPTERS</h2>

                <p>{mediaData.chapters || "Not Available"}</p>
              </>
              )}
            </li>

            <li className={`${styles.info_item}`}>

              <h2>TRENDING</h2>

              <p>{mediaData.trending || "Not Available"}</p>

            </li>

          </ul>

        </section>

        <section id={styles.info_container}>

          <div id={styles.description_episodes_related_container}>

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

                <p>Hover over the image to show the actor behind its character</p>

                {/* MAKE HOVER, THAN FLIP IMAGE AND SHOW THE ACTOR */}
                <div>
                  <ul className='display_flex_row'>
                    {mediaData.characters.edges.map((item, key: number) => (
                      <li key={key}>
                        <div className={styles.character_container}>
                          <div className={styles.img_container}>
                            <Image src={item.node.image.large} alt={item.node.name.full} fill></Image>
                          </div>
                          <h4><Link href={`/character/${item.id}`}>{item.node.name.full}</Link></h4>
                        </div>

                        <div className={styles.actor_container}>
                          <div className={styles.img_container}>
                            <Image src={item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.image.large} alt={item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.name.full || "No name actor"} fill></Image>
                          </div>
                          <h4>
                            <Link href={`/actor/${item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.id}`}>
                              {item.voiceActorRoles[0] && item.voiceActorRoles[0].voiceActor.name.full}
                            </Link>
                          </h4>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </section>
            )}

            {/* EPISODES ONLY IF ANIME */}
            {((mediaData.type == "ANIME")) && (
              <section id={styles.episodes_container}>

                <h2 className={styles.heading_style}>EPISODES</h2>

                <EpisodesContainer
                  data={mediaData.streamingEpisodes}
                  mediaTitle={mediaData.title.romaji}
                  mediaId={mediaData.id}
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

                <div className='display_flex_row space_beetween align_items_center'>
                  <h2 className={styles.heading_style}>RELATED TO {(mediaData.title.romaji).toUpperCase()}</h2>

                  {mediaData.relations.nodes.length > 12 && (
                    <Link href={`/related?id=${mediaData.id}`}>VIEW ALL <ChevonRightSvg width={16} height={16} alt="Icon to right" /></Link>
                  )}
                </div>
                <ul>

                  {(mediaData).relations.nodes.slice(0, 12).map((item, key: number) => (
                    <li key={key}>

                      <MediaItemCoverInfo positionIndex={key + 1} darkMode={true} data={item} />

                    </li>

                  ))}
                </ul>

              </section>
            )}

            {/* RECOMMENDATIONS ACCORDING TO THIS MEDIA */}
            {mediaData.recommendations.edges[0] && (
              <section id={styles.similar_container}>

                <h2 className={styles.heading_style}>SIMILAR {(mediaData.type).toUpperCase()}S YOU MAY LIKE</h2>

                <ul>

                  {mediaData.recommendations.edges.slice(0, 12).map((item, key: number) => (
                    <li key={key}>

                      <MediaItemCoverInfo positionIndex={key + 1} darkMode={true} data={item.node.mediaRecommendation} />

                    </li>

                  ))}

                </ul>

              </section>
            )}

          </div>

          <div id={styles.hype_container}>

            {/* <div>
              <h2 className={styles.heading_style}>HYPE</h2>

              <ul>

                <li><span>iii</span> 90%</li>
                <li><span>iii</span> 90%</li>
                <li><span>iii</span> 90%</li>

              </ul>
            </div> */}

            {(mediaData.trailer) && (
              <div id={styles.yt_video_container}>
                <h2 className={styles.heading_style}>TRAILER</h2>
                <iframe
                  className="yt_embed_video"
                  src={`https://www.youtube.com/embed/${mediaData.trailer.id}`}
                  frameBorder={0}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                  allowFullScreen></iframe>
              </div>
            )}

          </div>

        </section>

      </div>

    </div>
  )
}

export default MediaPage