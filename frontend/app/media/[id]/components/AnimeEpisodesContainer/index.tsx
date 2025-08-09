"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import NavigationButtons from "../../../../components/NavigationButtons";
import { GogoanimeMediaEpisodes } from "@/app/ts/interfaces/gogoanimeData";
import LoadingSvg from "@/public/assets/Eclipse-1s-200px.svg";
import {
  MediaData,
  MediaDataFullInfo,
  EpisodesType,
} from "@/app/ts/interfaces/anilistMediaData";
import PaginationButtons from "@/app/media/[id]/components/PaginationButtons";
import aniwatch from "@/app/api/aniwatch";
import {
  EpisodeAnimeWatch,
  EpisodesFetchedAnimeWatch,
  AniwatchMediaData,
} from "@/app/ts/interfaces/aniwatchData";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { AnimatePresence, motion, Variants } from "framer-motion";
import simulateRange from "@/app/lib/simulateRange";
import {
  optimizedFetchOnAniwatch,
  optimizedFetchOnGoGoAnime,
} from "@/app/lib/dataFetch/optimizedFetchAnimeOptions";
import { ImdbEpisode, ImdbMediaInfo } from "@/app/ts/interfaces/imdb";
import { SourceType } from "@/app/ts/interfaces/episodesSource";
import { checkAnilistTitleMisspelling } from "@/app/lib/checkApiMediaMisspelling";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/lib/redux/hooks";
import EpisodesOptionsPanel from "./components/EpisodesOptionsPanel";
import { EpisodeBySource } from "./components/EpisodeBySource";
import ErrorPanel from "../ErrorPanel";

type EpisodesContainerTypes = {
  imdb: {
    mediaSeasons: ImdbMediaInfo["seasons"];
    episodesList: ImdbEpisode[];
  };
  mediaInfo: MediaData | MediaDataFullInfo;
  crunchyrollInitialEpisodes: EpisodesType[];
  episodesWatchedOnAnilist?: number;
};

const framerMotionLoadingEpisodes: Variants = {
  initial: {
    opacity: 0.5,
  },
  animate: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      duration: 1,
      repeatType: "reverse",
    },
  },
  exit: {
    opacity: 0,
  },
};

export default function EpisodesContainer({
  imdb,
  mediaInfo,
  crunchyrollInitialEpisodes,
  episodesWatchedOnAnilist,
}: EpisodesContainerTypes) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [episodesList, setEpisodesList] = useState<
    | EpisodesType[]
    | GogoanimeMediaEpisodes[]
    | EpisodeAnimeWatch[]
    | ImdbEpisode[]
  >(crunchyrollInitialEpisodes);

  const [isEpisodesDubbed, setIsEpisodesDubbed] = useState<boolean | null>(
    null
  );

  const [mediaResultsInfoArray, setMediaResultsInfoArray] = useState<
    AniwatchMediaData[]
  >([]);

  const [currAnimesList, setCurrAnimesList] = useState<
    | EpisodesType[]
    | GogoanimeMediaEpisodes[]
    | EpisodeAnimeWatch[]
    | ImdbEpisode[]
    | null
  >(null);
  const [itemOffset, setItemOffset] = useState<number>(0);

  const [currEpisodesSource, setCurrEpisodesSource] =
    useState<SourceType["source"]>("crunchyroll");

  const [currEpisodesWatched, setCurrEpisodesWatched] = useState<
    {
      mediaId: number;
      episodeNumber: number;
      episodeTitle: string;
    }[]
  >();

  const searchParams = useSearchParams();

  const currSearchParams = new URLSearchParams(
    Array.from(searchParams.entries())
  );

  const [totalNumberPages, setTotalNumberPages] = useState<number>(0);
  const [currActivePage, setCurrActivePage] = useState<number>(0);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  // the episodes array length will be divided by 20, getting the range of pagination
  const rangeEpisodesPerPage = 20;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isEpisodesDubbed == null)
        setIsEpisodesDubbed(localStorage.getItem("dubEpisodes") == "true");
    }
  }, [typeof window]);

  useEffect(() => {
    if (user || anilistUser) getUserPreferredSource();
    else
      fetchEpisodesFromSource(
        crunchyrollInitialEpisodes.length == 0 ? "gogoanime" : "crunchyroll"
      );
  }, [user, anilistUser]);

  useEffect(() => {
    const endOffset = itemOffset + rangeEpisodesPerPage;

    if (currEpisodesSource == "crunchyroll")
      setTotalNumberPages(
        Math.ceil(crunchyrollInitialEpisodes.length / rangeEpisodesPerPage)
      );

    if (episodesList)
      setCurrAnimesList(episodesList.slice(itemOffset, endOffset));
  }, [
    episodesList,
    itemOffset,
    crunchyrollInitialEpisodes,
    currEpisodesSource,
  ]);

  useEffect(() => {
    if (user || anilistUser) getUserEpisodesWatched();
  }, [user, anilistUser, mediaInfo.id, currEpisodesSource, itemOffset]);

  useEffect(() => {
    const paramsSource = currSearchParams.get("source") as SourceType["source"];

    if (
      paramsSource == "crunchyroll" ||
      paramsSource == "aniwatch" ||
      paramsSource == "gogoanime"
    ) {
      setCurrEpisodesSource(paramsSource);
      fetchEpisodesFromSource(paramsSource);
    }
  }, [searchParams]);

  useEffect(() => {
    const pageParams = Number(currSearchParams.get("page"));

    if (episodesList && pageParams) {
      setItemOffset(
        ((pageParams || 0) * rangeEpisodesPerPage) % episodesList.length
      );
    }
  }, [episodesList, currSearchParams.get("source")]);

  useEffect(() => {
    if (currEpisodesSource != "crunchyroll")
      fetchEpisodesFromSource(currEpisodesSource);
  }, [isEpisodesDubbed]);

  // handles which page last episode watched is on
  useEffect(() => {
    if (!episodesWatchedOnAnilist) return;

    for (let pageIndex = 0; pageIndex < totalNumberPages; pageIndex++) {
      const episodesOnPage =
        (pageIndex * rangeEpisodesPerPage) % episodesList.length;

      if (episodesOnPage >= episodesWatchedOnAnilist) {
        handleButtonPageNavigation({ selected: pageIndex - 1 });

        setCurrActivePage(pageIndex - 1);

        return;
      }
    }
  }, [totalNumberPages]);

  async function getUserPreferredSource() {
    const useDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const userSelectedSource =
      (await useDoc.get("videoSource").toLowerCase()) || "crunchyroll";

    fetchEpisodesFromSource(userSelectedSource);

    setCurrEpisodesSource(userSelectedSource);
  }

  async function getUserEpisodesWatched() {
    if (!user && !anilistUser) return;

    const userDoc: DocumentSnapshot<DocumentData> = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const userEpisodesWatchedList = userDoc.get("episodesWatched");

    const mediaEpisodesWatchedList =
      userEpisodesWatchedList[mediaInfo.id] || null;

    if (mediaEpisodesWatchedList)
      setCurrEpisodesWatched(mediaEpisodesWatchedList);
  }

  async function fetchEpisodesFromSource(newSourceChose: SourceType["source"]) {
    setIsLoading(true);

    const paginationEndOffset = itemOffset + rangeEpisodesPerPage;

    let mediaEpisodesList:
      | GogoanimeMediaEpisodes[]
      | {
          episodesDub: number;
          episodesSub: number;
          episodes: EpisodesFetchedAnimeWatch["episodes"];
        };

    switch (newSourceChose) {
      case "crunchyroll":
        setCurrEpisodesSource(newSourceChose);

        setEpisodesList(crunchyrollInitialEpisodes);

        setCurrAnimesList(
          crunchyrollInitialEpisodes.slice(itemOffset, paginationEndOffset)
        );

        setTotalNumberPages(
          Math.ceil(crunchyrollInitialEpisodes.length / rangeEpisodesPerPage)
        );

        break;

      case "gogoanime":
        setCurrEpisodesSource(newSourceChose);

        mediaEpisodesList = (await optimizedFetchOnGoGoAnime({
          textToSearch: mediaInfo.title.english || mediaInfo.title.romaji,
          only: "episodes",
          isDubbed: isEpisodesDubbed || false,
        })) as GogoanimeMediaEpisodes[];

        if (!mediaEpisodesList) {
          setIsLoading(false);

          setEpisodesList([]);

          setCurrAnimesList(null);

          setTotalNumberPages(0);

          return;
        }

        setEpisodesList(mediaEpisodesList as GogoanimeMediaEpisodes[]);

        setCurrAnimesList(
          (mediaEpisodesList as GogoanimeMediaEpisodes[]).slice(
            itemOffset,
            paginationEndOffset
          )
        );

        setTotalNumberPages(
          Math.ceil(
            (mediaEpisodesList as GogoanimeMediaEpisodes[]).length /
              rangeEpisodesPerPage
          )
        );

        break;

      case "aniwatch":
        setCurrEpisodesSource(newSourceChose);

        const searchResultsListForCurrMedia = (await optimizedFetchOnAniwatch({
          textToSearch: mediaInfo.title.english || mediaInfo.title.romaji,
          only: "search_list",
          format: mediaInfo.format,
          mediaTotalEpisodes:
            mediaInfo.nextAiringEpisode?.episode || imdb.episodesList.length,
        })) as AniwatchMediaData[];

        setMediaResultsInfoArray(searchResultsListForCurrMedia);

        mediaEpisodesList = (await optimizedFetchOnAniwatch({
          textToSearch:
            mediaInfo.title.english || mediaInfo.title.userPreferred,
          only: "episodes",
          format: mediaInfo.format,
          mediaTotalEpisodes:
            mediaInfo.nextAiringEpisode?.episode || imdb.episodesList.length,
        })) as {
          episodesDub: number;
          episodesSub: number;
          episodes: EpisodesFetchedAnimeWatch["episodes"];
        };

        const episodesFilteredByDubOrSub = isEpisodesDubbed
          ? mediaEpisodesList.episodes.slice(0, mediaEpisodesList.episodesDub)
          : mediaEpisodesList.episodes.slice(0, mediaEpisodesList.episodesSub);

        setEpisodesList(episodesFilteredByDubOrSub);

        if (episodesFilteredByDubOrSub) {
          setCurrAnimesList(
            episodesFilteredByDubOrSub.slice(itemOffset, paginationEndOffset)
          );

          setTotalNumberPages(
            Math.ceil(episodesFilteredByDubOrSub.length / rangeEpisodesPerPage)
          );
        } else {
          setCurrAnimesList(null);

          setTotalNumberPages(0);
        }

        break;

      default:
        alert(
          "need to work on it. give me a shoutout on Git Issues if i forget"
        );

        break;
    }

    setIsLoading(false);
  }

  async function handleRefetchMediaEpisodesFromSelectTag(id: string) {
    setIsLoading(true);

    const endOffset = itemOffset + rangeEpisodesPerPage;

    const mediaEpisodes = (await aniwatch.getMediaEpisodes({
      mediaId: id,
    })) as EpisodesFetchedAnimeWatch;

    setEpisodesList(mediaEpisodes.episodes);

    setCurrAnimesList(mediaEpisodes.episodes.slice(itemOffset, endOffset));
    setTotalNumberPages(
      Math.ceil(mediaEpisodes.episodes.length / rangeEpisodesPerPage)
    );

    setIsLoading(false);
  }

  async function handleButtonPageNavigation(event: { selected: number }) {
    setIsLoading(true); // Needed to refresh episodes "Marked as Watched"

    const newOffset =
      (event.selected * rangeEpisodesPerPage) % episodesList.length;

    setItemOffset(newOffset);

    setTimeout(() => setIsLoading(false), 400); // Needed to refresh episodes "Marked as Watched"
  }

  const handleSourcesButtonValue: (
    parameter: SourceType["source"]
  ) => void = async (parameter: SourceType["source"]) => {
    setCurrEpisodesSource(parameter);

    fetchEpisodesFromSource(parameter);
  };

  return (
    <React.Fragment>
      <div id={styles.episodes_heading}>
        <h2 className={styles.heading_style}>EPISODES</h2>

        <EpisodesOptionsPanel
          callDubbedFunction={() => setIsEpisodesDubbed(!isEpisodesDubbed)}
          dubbedStateValue={isEpisodesDubbed || false}
          userId={user?.uid || anilistUser ? `${anilistUser?.id}` : undefined}
          isAnilistUser={
            user != undefined || anilistUser?.isUserFromAnilist || false
          }
          db={db}
          mediaInfo={mediaInfo}
          imdb={imdb}
        />
      </div>

      <div>
        <div id={styles.container_heading}>
          <NavigationButtons
            propsFunction={
              handleSourcesButtonValue as (parameter: string | number) => void
            }
            currValue={currEpisodesSource}
            showSourceStatus
            sepateBtnsWithSpan={true}
            buttonOptions={[
              { name: "Crunchyroll", value: "crunchyroll" },
              { name: "GoGoAnime", value: "gogoanime" },
              { name: "Aniwatch", value: "aniwatch" },
            ]}
          />

          {/* SHOWS A SELECT WITH OTHER RESULTS FOR THIS MEDIA, ANIWATCH DONT GET THE RIGHT RESULT MOST OF TIMES */}
          <AnimatePresence>
            {currEpisodesSource == "aniwatch" &&
              mediaResultsInfoArray.length > 1 && (
                <motion.div
                  id={styles.select_media_container}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <small>Wrong Episodes? Select bellow!</small>

                  <select
                    onChange={(e) =>
                      handleRefetchMediaEpisodesFromSelectTag(e.target.value)
                    }
                    defaultValue={checkAnilistTitleMisspelling(
                      mediaInfo.title.romaji || mediaInfo.title.native
                    ).toLowerCase()}
                  >
                    {mediaResultsInfoArray?.map((media, key) => (
                      <option key={key} value={media.id.toLowerCase()}>
                        {media.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
          </AnimatePresence>
        </div>

        {!isLoading && (
          <motion.ol
            id={styles.container}
            data-loading={isLoading}
            animate={{ height: "auto" }}
          >
            <AnimatePresence>
              {currAnimesList?.map(
                (
                  episode:
                    | EpisodesType
                    | GogoanimeMediaEpisodes
                    | EpisodeAnimeWatch
                    | ImdbEpisode,
                  key
                ) => (
                  <EpisodeBySource
                    key={key}
                    index={key}
                    episodeInfo={episode}
                    mediaInfo={mediaInfo}
                    currEpisodesSource={currEpisodesSource}
                    imdb={imdb}
                    crunchyrollInitialEpisodes={crunchyrollInitialEpisodes}
                    wasEpisodeWatchedOnAnilist={
                      episodesWatchedOnAnilist
                        ? key + itemOffset + 1 < episodesWatchedOnAnilist
                        : undefined
                    }
                    itemOffset={itemOffset}
                    currEpisodesWatched={currEpisodesWatched}
                    useDubbedRoute={isEpisodesDubbed || false}
                  />
                )
              )}
            </AnimatePresence>
          </motion.ol>
        )}

        {isLoading && (
          <motion.div
            id={styles.loading_episodes_container}
            variants={framerMotionLoadingEpisodes}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {simulateRange(rangeEpisodesPerPage).map((item, key) => (
              <div key={key}>
                <motion.div className={styles.loading_img_placeholder}>
                  <LoadingSvg width={60} height={60} alt="Loading Episodes" />
                </motion.div>

                <span className={styles.loading_text_placeholder}></span>
              </div>
            ))}
          </motion.div>
        )}

        {(episodesList?.length == 0 || episodesList == null) && !isLoading && (
          <ErrorPanel
            errorText={
              <>
                Not available on <span>{currEpisodesSource}</span>
              </>
            }
          />
        )}

        {totalNumberPages >= 1 && (
          <nav id={styles.pagination_buttons_container}>
            <PaginationButtons
              onPageChange={handleButtonPageNavigation}
              pageCount={totalNumberPages}
              redirectToPage={
                Number(currSearchParams.get("page")) || currActivePage
              }
            />
          </nav>
        )}
      </div>
    </React.Fragment>
  );
}
