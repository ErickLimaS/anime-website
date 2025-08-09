"use client";
import React, { SetStateAction, useEffect, useState } from "react";
import styles from "./component.module.css";
import Link from "next/link";
import {
  AiringMediaResult,
  MediaData,
} from "@/app/ts/interfaces/anilistMediaData";
import anilist from "@/app/api/anilist/anilistMedias";
import CloseSvg from "@/public/assets/x.svg";
import PlaySvg from "@/public/assets/play.svg";
import { Url } from "next/dist/shared/lib/router/router";
import * as MediaCard from "../../MediaCards/MediaCard";
import * as MediaCardClientSide from "../../MediaCards/MediaCard/variantClientSide";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import * as AddToFavourites from "../../Buttons/AddToFavourites";
import parse from "html-react-parser";
import ScoreRating from "../../DynamicAssets/ScoreRating";
import MediaFormatIcon from "../../DynamicAssets/MediaFormatIcon";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import SwiperCarousel from "./swiperCarousel";
import { SwiperSlide } from "swiper/react";
import { convertToUnix } from "@/app/lib/formatDateUnix";
import { getUserAdultContentPreference } from "@/app/lib/user/userDocFetchOptions";

export const revalidate = 1800; // revalidate cached data every 30 min

type ComponentType = {
  headingTitle: string;
  route: Url;
  sortBy: "RELEASE" | "FAVOURITES_DESC" | "UPDATED_AT_DESC";
  mediaFormat?: "ANIME" | "MANGA";
  isFetchByDateButtonsOnScreen?: boolean;
  onDarkBackground?: boolean;
  isLayoutInverted?: boolean;
  isResultsSortedByTrending?: boolean;
};

const framerMotionPopUpMedia = {
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

function NavigationThroughMedias({
  headingTitle,
  mediaFormat,
  isFetchByDateButtonsOnScreen,
  sortBy,
  onDarkBackground,
  isLayoutInverted,
  isResultsSortedByTrending,
}: ComponentType) {
  const [daysRange, setDaysRange] = useState<1 | 7 | 30>(1); // IF SORT = RELEASE --> 1: 1 day (today), 7: 7 days (week), 30: 30 days (month)

  const [mediaList, setMediaList] = useState<MediaData[]>([]);

  const [isTrailerBeeingShown, setIsTrailerBeeingShown] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isAdultContentSetToShow, setIsAdultContentSetToShow] = useState<
    boolean | null
  >(null);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mediaSelect, setMediaSelected] = useState<MediaData | null>(null);

  useEffect(() => {
    if (sortBy == "RELEASE") fetchMediaListByDays(1);
    else fetchMediaList();
  }, []);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  async function getUserPreference() {
    if (!user) return false;

    if (isAdultContentSetToShow) return isAdultContentSetToShow;

    const userAdultContentPreference: boolean =
      await getUserAdultContentPreference(user.uid);

    setIsAdultContentSetToShow(userAdultContentPreference);

    return userAdultContentPreference;
  }

  async function fetchMediaListByDays(days: 1 | 7 | 30) {
    setIsLoading(true);

    let fetchedMedia: AiringMediaResult[] | MediaData[] = [];

    const isAdultContentAllowed = await getUserPreference();

    fetchedMedia = (await anilist.getReleasingByDaysRange({
      type: mediaFormat || "ANIME",
      days: days!,
      perPage: 40,
      showAdultContent: isAdultContentAllowed,
    })) as AiringMediaResult[];

    // Remove releases from "today" to show on other options
    if (days != 1 && days != undefined) {
      fetchedMedia = (fetchedMedia as AiringMediaResult[]).filter(
        (item) =>
          convertToUnix(1) > item.airingAt &&
          item.airingAt > convertToUnix(days) &&
          item.media
      );
    }

    const mapResultMediaInnerInfo = (fetchedMedia as AiringMediaResult[]).map(
      (item) => item.media
    );

    fetchedMedia = mapResultMediaInnerInfo;

    setDaysRange(days!);

    if (isResultsSortedByTrending)
      fetchedMedia = (fetchedMedia as MediaData[])
        .sort((a, b) => a.trending - b.trending)
        .reverse();

    setMediaList(fetchedMedia as MediaData[]);

    setIsLoading(false);
  }

  async function fetchMediaList() {
    setIsLoading(true);

    let fetchedMedia: AiringMediaResult[] | MediaData[] = [];

    const isAdultContentAllowed = await getUserPreference();

    fetchedMedia = await anilist
      .getMediaForThisFormat({
        type: mediaFormat || "ANIME",
        sort: sortBy,
        pageNumber: 20,
        showAdultContent: isAdultContentAllowed,
      })
      .then((res) =>
        (res as MediaData[]).filter(
          (item) => item.isAdult == isAdultContentAllowed
        )
      );

    if (isResultsSortedByTrending)
      fetchedMedia = (fetchedMedia as MediaData[])
        .sort((a, b) => a.trending - b.trending)
        .reverse();

    setMediaList(fetchedMedia as MediaData[]);

    setIsLoading(false);
  }

  function handleMediaPopUpFocus(media: number | null) {
    if (media) {
      setSelectedId(media);
      setMediaSelected(
        mediaList.find(
          (item) => item.id == media
        ) as SetStateAction<MediaData | null>
      );

      return;
    }

    setSelectedId(null);
    setIsTrailerBeeingShown(false);
    setMediaSelected(null);
  }

  return (
    <React.Fragment>
      {isFetchByDateButtonsOnScreen && (
        <nav
          id={styles.nav_tabs_container}
          aria-label="Media By Range of Days Menu "
        >
          <ul className="display_flex_row">
            <li>
              <button
                disabled={daysRange === 1}
                data-active={daysRange == 1}
                onClick={() => fetchMediaListByDays(1)}
              >
                Today
              </button>
            </li>
            <span>/</span>
            <li>
              <button
                disabled={daysRange === 7}
                data-active={daysRange == 7}
                onClick={() => fetchMediaListByDays(7)}
              >
                This week
              </button>
            </li>
            <span>/</span>
            <li>
              <button
                disabled={daysRange === 30}
                data-active={daysRange == 30}
                onClick={() => fetchMediaListByDays(30)}
              >
                Last 30 days
              </button>
            </li>
          </ul>
        </nav>
      )}

      <motion.div
        id={styles.itens_container}
        data-darkBackground={onDarkBackground && onDarkBackground}
        data-layoutInverted={isLayoutInverted && isLayoutInverted}
        variants={framerMotionPopUpMedia}
        initial="initial"
        animate="animate"
      >
        <SwiperCarousel title={headingTitle} daysSelected={daysRange}>
          {mediaList.length > 0 ? (
            mediaList.map((media, key) => (
              <SwiperSlide key={media.id}>
                <MediaCardClientSide.FramerMotionContainer
                  onDarkMode={onDarkBackground}
                  positionIndex={key + 1}
                  isLoading={isLoading}
                  framerMotionProps={{
                    layoutId: String(media.id),
                    mediaId: media.id,
                    framerMotionExpandCardFunction: () =>
                      handleMediaPopUpFocus(media.id),
                  }}
                >
                  <MediaCard.MediaImg
                    hideOptionsButton
                    mediaInfo={media}
                    title={media.title.userPreferred}
                    formatOrType={media.format}
                    url={media.coverImage.large}
                  />

                  <MediaCard.SmallTag
                    seasonYear={media.seasonYear}
                    tags={media.genres[0]}
                  />

                  <MediaCard.Title title={media.title.userPreferred} />
                </MediaCardClientSide.FramerMotionContainer>
              </SwiperSlide>
            ))
          ) : (
            <p className="display_align_justify_center">
              {!isFetchByDateButtonsOnScreen && "No results"}
              {isFetchByDateButtonsOnScreen &&
                daysRange == 1 &&
                "Nothing Releasing Today"}
              {isFetchByDateButtonsOnScreen &&
                daysRange == 7 &&
                "Nothing Released in 7 Days"}
              {isFetchByDateButtonsOnScreen &&
                daysRange == 30 &&
                "Nothing Released in 30 Days"}
            </p>
          )}
        </SwiperCarousel>
      </motion.div>

      {/* WHEN A ID IS SELECTED, SHOWS A INFO PREVIEW OF MEDIA */}
      <AnimatePresence>
        {selectedId && mediaSelect && (
          <motion.div
            id={styles.overlay}
            onClick={() => handleMediaPopUpFocus(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={String(selectedId)}
              id={styles.expand_container}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: mediaSelect.bannerImage
                  ? `linear-gradient(to bottom right, rgba(0, 0, 0, 0.95) 25%, rgba(0, 0, 0, 0.75) ), url(${mediaSelect.bannerImage})`
                  : `var(--black-100)`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <motion.button
                onClick={() => handleMediaPopUpFocus(null)}
                title="Close"
              >
                <CloseSvg width={16} height={16} />
              </motion.button>

              <motion.div className={styles.media_container}>
                <motion.div className={styles.img_container}>
                  <Image
                    src={mediaSelect.coverImage.large}
                    alt={mediaSelect.title.userPreferred}
                    fill
                    sizes="(max-width: 430px) 45vw, (max-width: 620px) 33vw, (max-width: 876px) 15vw, 10vw"
                  />
                </motion.div>

                <motion.div className={styles.info_container}>
                  <motion.h5>
                    {mediaSelect.title.userPreferred}
                    {mediaSelect.seasonYear && (
                      <span> ({mediaSelect.seasonYear})</span>
                    )}
                  </motion.h5>

                  <motion.p
                    style={{
                      color: mediaSelect.coverImage.color || "var(--white-100)",
                    }}
                  >
                    <MediaFormatIcon format={mediaSelect.format} />{" "}
                    {mediaSelect.format == "TV" ? "ANIME" : mediaSelect.format}
                  </motion.p>

                  {mediaSelect.averageScore && (
                    <motion.p>
                      <ScoreRating
                        ratingScore={mediaSelect.averageScore / 2 / 10}
                        source="anilist"
                      />
                    </motion.p>
                  )}

                  {mediaSelect.episodes &&
                    mediaSelect.format != "MOVIE" &&
                    mediaSelect.format != "MUSIC" &&
                    mediaSelect.format != "MANGA" && (
                    <motion.p>{mediaSelect.episodes} Episodes</motion.p>
                  )}

                  {mediaSelect.genres && (
                    <motion.p className={styles.smaller_fonts}>
                      {mediaSelect.genres.map(
                        (item, key) =>
                          `${item}${
                            key + 1 == mediaSelect.genres.length ? "" : ", "
                          }`
                      )}
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>

              {/* SHOWS TRAILER / SHOWS DESCRIPTION */}
              {isTrailerBeeingShown ? (
                <motion.div className={styles.trailer_container}>
                  <iframe
                    className="yt_embed_video"
                    src={`https://www.youtube.com/embed/${mediaSelect.trailer.id}`}
                    frameBorder={0}
                    title={mediaSelect.title.userPreferred + " Trailer"}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              ) : (
                mediaSelect.description && (
                  <motion.div className={styles.description_container}>
                    <motion.p>
                      {parse(
                        mediaSelect.description.replace(
                          new RegExp(`<br[^>]*>|<\/br>`, "gi"),
                          " "
                        )
                      )}
                    </motion.p>
                  </motion.div>
                )
              )}

              <motion.div className={styles.btns_container}>
                <motion.div className={`${styles.action_btns_container}`}>
                  <Link href={`/media/${mediaSelect.id}`}>SEE MORE</Link>

                  <AddToFavourites.Button
                    svgOnlyColor={"var(--brand-color"}
                    mediaInfo={mediaSelect}
                  />
                </motion.div>

                {mediaSelect.trailer && (
                  <motion.div
                    className={`${styles.action_btns_container} ${styles.trailer_btn_container}`}
                  >
                    <motion.button
                      className={styles.trailer_btn}
                      onClick={() =>
                        setIsTrailerBeeingShown(!isTrailerBeeingShown)
                      }
                      data-active={isTrailerBeeingShown}
                    >
                      <PlaySvg alt="Play" width={16} height={16} /> TRAILER
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

export default NavigationThroughMedias;
