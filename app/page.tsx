import styles from "./page.module.css";
import Link from "next/link";
import React from "react";
import HeroCarousel from "./components/HomePage/HeroCarouselHomePage";
import anilist from './api/anilist';
import NavThoughMedias from "./components/HomePage/NavThoughMedias";
import parse from "html-react-parser"
import NewestMediaSection from "./components/HomePage/NewestMediaSection";
import MediaRankingSection from "./components/HomePage/MediaRankingSection";
import { ApiAiringMidiaResults, ApiDefaultResult } from "./ts/interfaces/apiAnilistDataInterface";
import { Metadata } from "next";
import AddToPlaylistButton from "./components/Buttons/AddToPlaylist";
import { checkDeviceIsMobile } from "./lib/checkMobileOrDesktop";
import { headers } from "next/headers";
import KeepWatchingSection from "./components/HomePage/KeepWatchingSection";
import PopularMediaSection from "./components/HomePage/PopularMediaSection";

export const revalidate = 21600 // revalidate cached data every 6 hours

export const metadata: Metadata = {
  title: 'Home | AniProject',
  description: "A anime platform that showcases popular and trending animes, mangas and movies. Explore the latest releases, keep watching your favorites, and discover what's popular in the anime world.",
}

export default async function Home() {

  const isMobileScreen = checkDeviceIsMobile(headers())

  // section 2
  const trendingData = await anilist.getNewReleases("ANIME", undefined, undefined, false, "RELEASING", 1, 12).then(
    res => (res as ApiDefaultResult[])
  )

  // section 3
  const mediaBannerData = await anilist.getMediaForThisFormat("ANIME", "SCORE_DESC").then(
    res => (res as ApiDefaultResult[]).filter((item) => item.isAdult == false)
  )

  // section 4
  const mediaRankingData = await anilist.getMediaForThisFormat("ANIME") as ApiDefaultResult[]
  const newestMediaData = await anilist.getReleasingByDaysRange("ANIME", 1, undefined, 11).then(
    res => ((res as ApiAiringMidiaResults[]).sort((a, b) => a.media.popularity - b.media.popularity).reverse())
  ).then(res => res.map((item) => item.media))

  // section 1 => uses same data, but filtered to the ones that has banner img
  const popularData = mediaRankingData.filter(item => item.bannerImage)

  // used on banner section
  const randomNumber = Math.floor(Math.random() * (mediaBannerData?.length || 10)) + 1

  return (
    <main id={styles.container} className={styles.main}>

      {/* PAGE HERO */}
      <HeroCarousel data={popularData} isMobile={isMobileScreen || false} />

      {/* Keep Watching  */}
      <KeepWatchingSection />

      {/* POPULAR MEDIA  SECTION*/}
      <PopularMediaSection initialData={trendingData} />

      {/* SECTION => SHOWS MEDIA RELEASED BY A SELECTED TIME (today, 7 days, 30 days)  */}
      <section className={styles.medias_sections_container}>

        <NavThoughMedias title={"Latest Releases"} route={"#"} sort="RELEASE" dateOptions={true} sortResultsByTrendingLevel />

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
                <span>{parse(mediaBannerData[randomNumber].description.replace(new RegExp(`<br[^>]*>|<\/br>`, 'gi'), " "))}</span>
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
                  src={`https://www.youtube.com/embed/${mediaBannerData[randomNumber].trailer.id}?controls=0&showinfo=0`}
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

        {/* SECTION => MANGAS SORTED BY FAVOURITES */}
        <section className={`${styles.medias_sections_container} ${styles.transparent_background}`}>

          <NavThoughMedias title={"Best Rated Mangas"} route={"#"} mediaFormat="MANGA" sort={"FAVOURITES_DESC"} darkBackground={true} />

        </section>

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
