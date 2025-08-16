"use client";
import React, { useEffect, useState } from "react";
import styles from "./carouselComponent.module.css";
import Link from "next/link";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { wrap } from "popmotion";
import { AnimatePresence, motion } from "framer-motion";
import * as AddToFavourites from "../../Buttons/AddToFavourites";
import SwiperCarouselContainer from "../../SwiperCarouselContainer";
import ListItemHeroCarousel from "./components/HeroListCarousel";
import EyeSvg from "@/public/assets/eye-fill.svg";
import EyeSlashSvg from "@/public/assets/eye-slash-fill.svg";
import { convertFromUnix } from "@/app/lib/formatDateUnix";
import { SwiperSlide } from "swiper/react";

const framerMotionVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

function HeroCarousel({
  animesList,
  isOnMobileScreen,
}: {
  animesList: MediaData[];
  isOnMobileScreen: boolean;
}) {
  const [[page, direction], setPage] = useState([0, 0]);

  const [autoPlayTrailer, setAutoPlayTrailer] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem("autoPlayTrailer") == undefined) {
      setAutoPlayTrailer(true);
      localStorage.setItem("autoPlayTrailer", "true");

      return;
    }

    setAutoPlayTrailer(localStorage.getItem("autoPlayTrailer") == "true");
  }, []);

  // Slide Carousel Props
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const currMediaOnScreenIndex = wrap(0, animesList.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const backgroundImageStyle = {
    background: isOnMobileScreen
      ? `linear-gradient(rgba(0, 0, 0, 0.05), var(--background) 100%), url(${animesList[currMediaOnScreenIndex]?.coverImage.extraLarge})`
      : `linear-gradient(rgba(0, 0, 0, 0.00), var(--background) 100%), url(${animesList[currMediaOnScreenIndex]?.bannerImage})`,
    backgroundPosition: isOnMobileScreen ? "top" : "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  // change auto play trailer state
  function changeAutoPlayTrailerState() {
    localStorage.setItem("autoPlayTrailer", `${!autoPlayTrailer}`);
    setAutoPlayTrailer(!autoPlayTrailer);
  }

  function handleBcgImgTransition(e: { target: { outerText: string } }) {
    setPage([
      animesList.findIndex(
        (item) => item.title.userPreferred == e.target.outerText
      ),
      animesList.findIndex(
        (item) => item.title.userPreferred == e.target.outerText
      ),
    ]);
  }

  return (
    <section id={styles.hero_section_container}>
      {/* CAROUSEL OF BCG IMG AND MEDIA TITLE*/}
      {animesList != undefined && (
        <AnimatePresence initial={true} custom={direction} mode="sync">
          <ul
            id="carousel"
            className={`${styles.carousel_container} display_flex_row`}
          >
            <motion.li
              key={page}
              className={styles.carousel_item}
              style={backgroundImageStyle}
              custom={direction}
              variants={framerMotionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
            >
              {autoPlayTrailer &&
                animesList[currMediaOnScreenIndex]?.trailer && (
                <AnimatePresence>
                  <motion.div className={styles.video_container}>
                    <motion.iframe
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      src={`https://www.youtube.com/embed/${animesList[currMediaOnScreenIndex].trailer.id}?controls=0&autoplay=1&mute=1&playsinline=1&loop=1&showinfo=0&playlist=${animesList[currMediaOnScreenIndex].trailer.id}`}
                      frameBorder={0}
                      title={
                        animesList[currMediaOnScreenIndex].title
                          .userPreferred + " Trailer"
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              <div className={styles.carousel_position_wrapper}>
                <div className={styles.item_info}>
                  <h2>
                    <Link
                      href={`/media/${animesList[currMediaOnScreenIndex]?.id}`}
                    >
                      {animesList[currMediaOnScreenIndex]?.title.userPreferred}
                    </Link>
                  </h2>

                  <div
                    className={`${styles.item_info_inside} display_flex_row`}
                  >
                    {animesList[currMediaOnScreenIndex]?.seasonYear && (
                      <p>
                        {animesList[
                          currMediaOnScreenIndex
                        ].seasonYear.toString()}
                      </p>
                    )}
                    {animesList[currMediaOnScreenIndex]?.genres &&
                      animesList[currMediaOnScreenIndex]?.seasonYear !=
                        undefined && <span>|</span>}

                    {animesList[currMediaOnScreenIndex]?.genres && (
                      <p>
                        <Link
                          href={`/search?genre=[${animesList[currMediaOnScreenIndex]?.genres[0]?.toLowerCase()}]`}
                        >
                          {animesList[currMediaOnScreenIndex]?.genres[0] || "Unknown"}
                        </Link>
                      </p>
                    )}
                    {animesList[currMediaOnScreenIndex]?.seasonYear !=
                      undefined &&
                      animesList[currMediaOnScreenIndex]?.episodes !=
                        undefined &&
                      animesList[currMediaOnScreenIndex]?.nextAiringEpisode ==
                        null && <span>|</span>}

                    {animesList[currMediaOnScreenIndex]?.episodes &&
                      animesList[currMediaOnScreenIndex].format != "MOVIE" &&
                      animesList[currMediaOnScreenIndex]?.nextAiringEpisode ==
                        null && (
                      <p>
                        {animesList[
                          currMediaOnScreenIndex
                        ].episodes.toString()}{" "}
                        {animesList[currMediaOnScreenIndex].episodes > 1
                          ? "Episodes"
                          : "Episode"}
                      </p>
                    )}
                    {animesList[currMediaOnScreenIndex]?.duration &&
                      animesList[currMediaOnScreenIndex].format == "MOVIE" && (
                      <p>
                        {animesList[currMediaOnScreenIndex].duration} Minutes
                      </p>
                    )}
                    {animesList[currMediaOnScreenIndex]?.nextAiringEpisode && (
                      <span>|</span>
                    )}

                    {animesList[currMediaOnScreenIndex]?.nextAiringEpisode && (
                      <p>
                        Ep{" "}
                        {
                          animesList[currMediaOnScreenIndex]?.nextAiringEpisode
                            .episode
                        }{" "}
                        on{" "}
                        {convertFromUnix(
                          animesList[currMediaOnScreenIndex]?.nextAiringEpisode
                            .airingAt,
                          { month: "long", year: undefined }
                        )}
                      </p>
                    )}
                  </div>

                  <div className={styles.item_buttons}>
                    <Link
                      href={`/media/${animesList[currMediaOnScreenIndex]?.id}`}
                    >
                      {animesList[currMediaOnScreenIndex].format == "MANGA"
                        ? "READ"
                        : "WATCH"}{" "}
                      NOW
                    </Link>

                    <AddToFavourites.Button
                      mediaInfo={animesList[currMediaOnScreenIndex]}
                    />
                  </div>
                </div>
              </div>
            </motion.li>
          </ul>
        </AnimatePresence>
      )}

      {/* RECOMENDATIONS GRID */}
      <div id={styles.recomendations_position_wrapper}>
        <div id={styles.recomendations_container}>
          <h3>Todays Recomendation</h3>

          {/* SHOWS ONLY ON MOBILE */}
          <div id={styles.swiper_list_container}>
            {animesList != undefined && (
              <SwiperCarouselContainer
                options={{
                  slidesPerView: 2,
                  bp480: 2,
                  bp740: 3,
                  bp1275: 3,
                }}
              >
                {animesList.slice(0, 9).map((item, key) => (
                  <SwiperSlide
                    key={key}
                    className="custom_swiper_list_item"
                    role="listitem"
                  >
                    <ListItemHeroCarousel
                      animeInfo={item as MediaData}
                      handleFunction={handleBcgImgTransition as () => void}
                    />
                  </SwiperSlide>
                ))}
              </SwiperCarouselContainer>
            )}
          </div>

          {/* SHOWS ONLY ON DESKTOP */}
          <ul>
            {animesList != undefined &&
              animesList
                .slice(0, 9)
                .map(
                  (media, key: number) =>
                    media.bannerImage && (
                      <ListItemHeroCarousel
                        animeInfo={media}
                        handleFunction={() => setPage([key, key])}
                        key={key}
                      />
                    )
                )}
          </ul>
        </div>
      </div>

      {/* STOP/PLAY TRAILER BUTTON */}
      <div id={styles.stop_trailer_btn_container}>
        <motion.button
          onClick={() => changeAutoPlayTrailerState()}
          whileTap={{ scale: 0.9 }}
        >
          {autoPlayTrailer ? (
            <>
              <EyeSlashSvg width={16} height={16} /> Stop Auto Play Trailer
            </>
          ) : (
            <>
              <EyeSvg width={16} height={16} /> Auto Play Trailer
            </>
          )}
        </motion.button>
      </div>
    </section>
  );
}

export default HeroCarousel;
