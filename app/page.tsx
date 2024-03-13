import styles from "./page.module.css";
import Link from "next/link";
import React from "react";
import HeroCarousel from "./components/HomePage/HeroCarouselHomePage";
import MediaItemCoverInfo from "./components/MediaItemCoverInfo";
import ChevronRightIcon from '../public/assets/chevron-right.svg';
import API from '../api/anilist';
import NavThoughMedias from "./components/HomePage/NavThoughMedias";
import parse from "html-react-parser"
import NewestMediaSection from "./components/NewestMediaSection";
import MediaRankingSection from "./components/MediaRankingSection";
import { ApiAiringMidiaResults, ApiDefaultResult } from "./ts/interfaces/apiAnilistDataInterface";
import { Metadata } from "next";
import AddToPlaylistButton from "./components/AddToPlaylistButton";
import SwiperListContainer from "./components/SwiperListContainer";
import { checkDeviceIsMobile } from "./lib/checkMobileOrDesktop";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: 'Home | AniProject',
  description: 'A website which shows a variety of info about animes, mangas and movies.',
}

export const revalidate = 1800 // revalidate the data every 30 min

export default async function Home() {

  const isMobileScreen = checkDeviceIsMobile(headers())

  // section 1
  const popularData = await API.getNewReleases("ANIME", undefined, "TRENDING_DESC").then(
    res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false && item.bannerImage)
  )

  // section 2
  const trendingData = await API.getNewReleases("ANIME").then(
    res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
  )

  // section 3
  const mediaBannerData = await API.getMediaForThisFormat("ANIME", "SCORE_DESC").then(
    res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
  )

  // section 4
  const mediaRankingData = await API.getMediaForThisFormat("ANIME").then(
    res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
  )
  const newestMediaData = await API.getReleasingByDaysRange("ANIME", 1, undefined, 11).then(
    res => (res as ApiAiringMidiaResults[]).map((item) => item.media).filter((item) => item.isAdult == false)
  ).then(res => res.sort((a, b) => a.popularity - b.popularity).reverse())

  // used on banner section
  const randomNumber = Math.floor(Math.random() * (mediaBannerData?.length || 10)) + 1

  return (
    <main id={styles.container} className={styles.main}>

      <section id={styles.hero_section}>

        <HeroCarousel data={popularData} isMobile={isMobileScreen || false} />

      </section>

      {/* POPULAR MEDIA  SECTION*/}
      <section id={styles.popular_container} >

        <div id={styles.title_container}>

          <h2>Popular Animes to Watch Now</h2>

          <p>Most watched animes by days</p>

          <span></span>

          <Link href={'#'}>VIEW ALL <ChevronRightIcon width={16} height={16} /></Link>

        </div>

        {/* SHOWS ONLY ON MOBILE */}
        <div id={styles.popular_list_container}>
          <SwiperListContainer
            data={trendingData}
          />
        </div>

        {/* SHOWS ON DESKTOP*/}
        {trendingData != undefined &&
          (trendingData.slice(0, 12).map((item, key: number) => (
            <MediaItemCoverInfo data={item} key={key} positionIndex={key + 1} darkMode={true} hiddenOnDesktop />
          ))
          )
        }

      </section>

      <div id={styles.navigation_link_container}>

        <span id={styles.line}></span>

        <Link href="/popular">+ View more</Link>

      </div>

      {/* SECTION => SHOWS MEDIA RELEASED BY A SELECTED TIME (today, 7 days, 30 days)  */}
      <section className={styles.medias_sections_container}>

        <NavThoughMedias title={"Latest Releases"} route={"#"} sort="RELEASE" dateOptions={true} />

      </section>

      {/* SECTION => Media Banner With Trailer Embeded  */}
      {mediaBannerData != (undefined || null) && (
        <section id={styles.media_banner_container}
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${mediaBannerData[randomNumber] && mediaBannerData[randomNumber].bannerImage})`
          }}>

          <div>

            <div id={styles.media_info}>
              {mediaBannerData[randomNumber] && (
                <h3><Link href={`/media/${mediaBannerData[randomNumber].id}`}>{mediaBannerData[randomNumber].title.romaji}</Link></h3>
              )}

              {mediaBannerData[randomNumber]?.description && (
                <span>{parse(mediaBannerData[randomNumber].description)}</span>
              )}

              <div className={styles.item_buttons}>

                <Link href={`/media/${mediaBannerData[randomNumber].id}`}>WATCH NOW</Link>

                <AddToPlaylistButton data={mediaBannerData[randomNumber]} />

              </div>
            </div>

            <div id={styles.player_button_container}>

              {(mediaBannerData[randomNumber].trailer) && (
                <iframe
                  className="yt_embed_video"
                  src={`https://www.youtube.com/embed/${mediaBannerData[randomNumber].trailer.id}`}
                  frameBorder={0}
                  title={mediaBannerData[randomNumber].title.romaji + " Trailer"}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                  allowFullScreen></iframe>
              )}

            </div>
          </div>

        </section>
      )}


      {/* SECTION => SHOWS MEDIAS SORTED BY FAVOURITES */}
      <section className={`${styles.medias_sections_container} ${styles.dark_background}`}>

        <NavThoughMedias title={"All Time Favorites"} route={"#"} sort={"FAVOURITES_DESC"} darkBackground={true} />

      </section>


      {/* SECTION => SHOWS MEDIAS SORTED BY LATEST UPDATES ON ANILIST */}
      <section className={`${styles.medias_sections_container}`}>

        <NavThoughMedias title={"Show Me Something New"} route={"#"} sort={"UPDATED_AT_DESC"} layoutInverted={true} />

      </section>

      {/* RANKING and NEWEST SECTION */}
      <section className={styles.background}>

        <div id={styles.media_ranks_container}>

          {/* RANKING CONTAINER */}
          <MediaRankingSection data={mediaRankingData} />

          {/* NEWEST CONTAINER*/}
          <NewestMediaSection data={newestMediaData} />

        </div>

      </section>

    </main>
  );
}
