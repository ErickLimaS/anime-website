"use client";
import React, { useState } from "react";
import * as MediaCard from "../../MediaCards/MediaCard";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import Link from "next/link";
import styles from "./component.module.css";
import ChevronRightIcon from "@/public/assets/chevron-right.svg";
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg";
import SwiperCarouselContainer from "../../SwiperCarouselContainer";
import { AnimatePresence, motion } from "framer-motion";
import anilist from "@/app/api/anilist/anilistMedias";
import { SwiperSlide } from "swiper/react";

const framerMotionVariants = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function PopularMediaSection({ animesList }: { animesList: MediaData[] }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBtnDisable, setIsBtnDisable] = useState<boolean>(false);

  const [fetchedData, setFetchedData] = useState<MediaData[]>([]);
  const [currFetchPage, setCurrFetchPage] = useState(2); // next fetch will start on page 2

  async function fetchAnimesListNextPage() {
    setIsLoading(true);

    const listAnimesReleasingByPopularity = await anilist
      .getNewReleases({
        type: "ANIME",
        showAdultContent: false,
        status: "RELEASING",
        page: currFetchPage,
        perPage: 14,
      })
      .then((res) => res as MediaData[]);

    if (
      !listAnimesReleasingByPopularity ||
      listAnimesReleasingByPopularity.length == 0
    ) {
      setIsBtnDisable(true);
      setIsLoading(false);

      return;
    }

    if (listAnimesReleasingByPopularity.length <= 13) setIsBtnDisable(true);

    const olderListWithNewResults = [
      ...fetchedData,
      ...listAnimesReleasingByPopularity,
    ];

    setFetchedData(olderListWithNewResults);
    setCurrFetchPage(currFetchPage + 1);

    setIsLoading(false);
  }

  return (
    <React.Fragment>
      <section id={styles.popular_container}>
        <React.Fragment>
          <div id={styles.title_container}>
            <h2>Popular Animes to Watch Now</h2>

            <p>Most watched animes by days</p>

            <span></span>

            <Link href={"#"}>
              VIEW ALL <ChevronRightIcon width={16} height={16} />
            </Link>
          </div>

          {/* SHOWS ONLY ON MOBILE */}
          <div id={styles.popular_list_container}>
            <SwiperCarouselContainer>
              {(fetchedData?.length > 0
                ? [...animesList, ...fetchedData]
                : animesList
              ).map((media, key) => (
                <SwiperSlide
                  key={key}
                  className="custom_swiper_list_item"
                  role="listitem"
                >
                  <MediaCard.Container
                    key={key}
                    positionIndex={key + 1}
                    onDarkMode
                    isHiddenOnDesktop
                  >
                    <MediaCard.MediaImgLink
                      mediaInfo={media}
                      mediaId={media.id}
                      title={media.title.userPreferred}
                      formatOrType={media.format}
                      url={media.coverImage.large}
                    />

                    <MediaCard.SmallTag
                      seasonYear={media.seasonYear}
                      tags={media.genres[0]}
                    />

                    <MediaCard.LinkTitle
                      title={media.title.userPreferred}
                      id={media.id}
                    />
                  </MediaCard.Container>
                </SwiperSlide>
              ))}
            </SwiperCarouselContainer>
          </div>

          {animesList.map((media, key: number) => (
            <MediaCard.Container key={key} onDarkMode>
              <MediaCard.MediaImgLink
                mediaInfo={media}
                mediaId={media.id}
                title={media.title.userPreferred}
                formatOrType={media.format}
                url={media.coverImage.large}
              />

              <MediaCard.SmallTag
                seasonYear={media.seasonYear}
                tags={media.genres[0]}
              />

              <MediaCard.LinkTitle
                title={media.title.userPreferred}
                id={media.id}
              />
            </MediaCard.Container>
          ))}
        </React.Fragment>
      </section>

      <AnimatePresence>
        {fetchedData?.length > 0 && (
          <motion.div
            id={styles.new_fetched_data_container}
            variants={framerMotionVariants}
            initial={"initial"}
            animate={"animate"}
          >
            {fetchedData?.map((media, key: number) => (
              <MediaCard.Container key={key} onDarkMode>
                <MediaCard.MediaImgLink
                  mediaInfo={media}
                  mediaId={media.id}
                  title={media.title.userPreferred}
                  formatOrType={media.format}
                  url={media.coverImage.large}
                />

                <MediaCard.SmallTag
                  seasonYear={media.seasonYear}
                  tags={media.genres[0]}
                />

                <MediaCard.LinkTitle
                  title={media.title.userPreferred}
                  id={media.id}
                />
              </MediaCard.Container>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOWS ONLY ON DESKTOP */}
      <div id={styles.navigation_link_container}>
        <span id={styles.line}></span>

        <motion.button
          aria-label={isLoading ? "wait the loading" : "+ View more"}
          onClick={() => fetchAnimesListNextPage()}
          data-loading={isLoading}
          disabled={isBtnDisable}
        >
          {isLoading ? <LoadingSvg width={16} height={16} /> : "+ View more"}
        </motion.button>
      </div>
    </React.Fragment>
  );
}

export default PopularMediaSection;
