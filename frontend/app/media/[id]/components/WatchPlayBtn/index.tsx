"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import pageStyles from "../../components/PageHeading/GridInfo/component.module.css";
import PlaySvg from "@/public/assets/play2.svg";
import LoadingSvg from "@/public/assets/Eclipse-1s-200px-custom-color.svg";
import { useRouter } from "next/navigation";
import { getAuth, User } from "firebase/auth";
import { initFirebase } from "@/app/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import {
  optimizedFetchOnAniwatch,
  optimizedFetchOnGoGoAnime,
  optimizedFetchOnZoro,
} from "@/app/lib/dataFetch/optimizedFetchAnimeOptions";
import { AnimatePresence, motion } from "framer-motion";
import { GogoanimeMediaEpisodes } from "@/app/ts/interfaces/gogoanimeData";
import { EpisodeAnimeWatch } from "@/app/ts/interfaces/aniwatchData";
import { useAppSelector } from "@/app/lib/redux/hooks";
import { KeepWatchingMediaData } from "@/app/ts/interfaces/firestoreData";
import DubbedCheckboxButton from "../AnimeEpisodesContainer/components/ActiveDubbButton";
import { SourceType } from "@/app/ts/interfaces/episodesSource";
import { sourcesAvailable } from "../../../../data/animeSourcesAvailable";

export default function PlayBtn({
  mediaId,
  mediaTitle,
  mediaFormat,
  anilistLastEpisodeWatched,
}: {
  mediaId: number;
  mediaTitle: string;
  mediaFormat: string;
  anilistLastEpisodeWatched?: number;
}) {
  const [episodeId, setEpisodeId] = useState<string | null>("");
  const [episodeNumber, setEpisodeNumber] = useState<number>();
  const [episodeLastStop, setEpisodeLastStop] = useState<number>();
  const [episodeDuration, setEpisodeDuration] = useState<number>();

  const [isDubbedActive, setIsDubbedActive] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [sourceName, setSourceName] = useState<SourceType["source"]>();

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  const router = useRouter();

  useEffect(() => {
    if (anilistUser || (user && !loading)) checkLastEpisodeWatched();
    else fetchMediaEpisodeUrl({ hasUser: anilistUser || user ? true : false });
  }, [user, anilistUser, episodeNumber]);

  useEffect(() => {
    if (sourceName) fetchMediaEpisodeUrl({ source: sourceName });
  }, [sourceName, isDubbedActive]);

  useEffect(() => {
    if (mediaId && episodeId) setIsLoading(false);
  }, [mediaId, episodeNumber, episodeId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDubbedActive(localStorage.getItem("dubEpisodes") == "true");
    }
  }, [typeof window]);

  async function checkLastEpisodeWatched() {
    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    if (!userDoc) {
      fetchMediaEpisodeUrl({});

      return;
    }

    const lastEpisodeWatched = await checkIfMediaIsOnKeepWatchingList();

    if (lastEpisodeWatched) return; // Priority for Keep Watching Episodes

    const userPreferredSource = userDoc.get("videoSource") || "aniwatch";

    const episodesWatchedList = userDoc.get("episodesWatched");

    if (episodesWatchedList) setSourceName(userPreferredSource);

    if (episodesWatchedList[mediaId]) {
      // SORT ARRAY TO GET THE HIGHEST EPISODE NUMBER ON FIRST INDEX
      const lastestEpisodeMarkedAsWatched = episodesWatchedList[mediaId].sort(
        function (a: { episodeNumber: number }, b: { episodeNumber: number }) {
          return b.episodeNumber - a.episodeNumber;
        }
      )[0];

      if (anilistLastEpisodeWatched) {
        await fetchMediaEpisodeUrl({
          source: userPreferredSource,
          lastEpisodeWatchedNumber:
            anilistLastEpisodeWatched >
            lastestEpisodeMarkedAsWatched.episodeNumber
              ? anilistLastEpisodeWatched
              : lastestEpisodeMarkedAsWatched.episodeNumber,
        });

        return;
      }

      await fetchMediaEpisodeUrl({
        source: userPreferredSource,
        lastEpisodeWatchedNumber: lastestEpisodeMarkedAsWatched.episodeNumber,
      });

      return;
    }

    if (anilistLastEpisodeWatched) {
      await fetchMediaEpisodeUrl({
        source: userPreferredSource,
        lastEpisodeWatchedNumber: anilistLastEpisodeWatched,
      });

      return;
    }

    // IF NO EPISODE WATCHED, IT FETCHS THE MEDIA'S FIRST EPISODE
    return fetchMediaEpisodeUrl({ source: episodesWatchedList });
  }

  async function checkIfMediaIsOnKeepWatchingList() {
    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    let userKeepWatchingList = await userDoc.get("keepWatching");

    const listFromObjectToArray = Object.keys(userKeepWatchingList).map(
      (key) => {
        return userKeepWatchingList[key];
      }
    );

    userKeepWatchingList = listFromObjectToArray.filter(
      (item) => item.length != 0 && item
    );

    const mediaLastEpisodeWatched: KeepWatchingMediaData =
      userKeepWatchingList.find(
        (item: KeepWatchingMediaData) => item.id == mediaId
      );

    if (!mediaLastEpisodeWatched) return null;

    setSourceName(mediaLastEpisodeWatched.source);
    setEpisodeId(mediaLastEpisodeWatched.episodeId);
    setEpisodeNumber(Number(mediaLastEpisodeWatched.episode));
    setEpisodeDuration(mediaLastEpisodeWatched.episodeDuration);
    setEpisodeLastStop(mediaLastEpisodeWatched.episodeTimeLastStop);

    return mediaLastEpisodeWatched;
  }

  async function fetchMediaEpisodeUrl({
    hasUser,
    lastEpisodeWatchedNumber,
    source,
  }: {
    hasUser?: boolean;
    lastEpisodeWatchedNumber?: number;
    source?: string;
  }) {
    setIsLoading(true);

    if (hasUser) {
      const userDoc = await getDoc(
        doc(db, "users", user?.uid || `${anilistUser?.id}`)
      );

      const userPreferredSource = userDoc.get("videoSource") || "gogoanime";

      source = userPreferredSource;
    }

    function findNextEpisode({
      episodes,
    }: {
      episodes: GogoanimeMediaEpisodes[] | EpisodeAnimeWatch[];
    }) {
      // adds 1 to get the next episode after the last watched
      const nextEpisodeAfterLastWatched = episodes.find(
        (episode: { number: number }) =>
          episode.number == lastEpisodeWatchedNumber! + 1
      );

      if (nextEpisodeAfterLastWatched) {
        setEpisodeId(
          sourceName == "gogoanime" || "zoro"
            ? (nextEpisodeAfterLastWatched as GogoanimeMediaEpisodes)!.id
            : (nextEpisodeAfterLastWatched as EpisodeAnimeWatch)!.episodeId
        );

        // adds 1 to get the next episode after the last watched
        setEpisodeNumber(lastEpisodeWatchedNumber! + 1);

        setIsLoading(false);

        return true;
      }

      return false;
    }

    async function fetchOnConsumet({
      source,
    }: {
      source: "gogoanime" | "zoro";
    }) {
      let searchResultsForMedia;

      switch (source) {
        case "gogoanime":
          searchResultsForMedia = await optimizedFetchOnGoGoAnime({
            textToSearch: mediaTitle,
            only: "episodes",
            isDubbed: isDubbedActive,
          });

          setSourceName("gogoanime");

          return searchResultsForMedia;
        case "zoro":
          searchResultsForMedia = await optimizedFetchOnZoro({
            textToSearch: mediaTitle,
            only: "episodes",
            isDubbed: isDubbedActive,
          });

          setSourceName("zoro");

          return searchResultsForMedia;
        default:
          return null;
      }
    }

    async function fetchOnAniWatch() {
      const searchResultsForMedia = await optimizedFetchOnAniwatch({
        textToSearch: mediaTitle,
        only: "episodes",
        // isDubbed: isDubbedActive,
        format: mediaFormat,
      }).then(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (res: any) => res.episodes
      );

      setSourceName("aniwatch");

      return searchResultsForMedia;
    }

    if (source) {
      let currMediaInfo: GogoanimeMediaEpisodes[] | EpisodeAnimeWatch[] | null =
        null;

      switch (source) {
        case "gogoanime":
          currMediaInfo = (await fetchOnConsumet({
            source,
          })) as GogoanimeMediaEpisodes[];

          break;

        case "zoro":
          currMediaInfo = (await fetchOnConsumet({
            source,
          })) as GogoanimeMediaEpisodes[];

          break;

        case "aniwatch":
          currMediaInfo = (await fetchOnAniWatch()) as EpisodeAnimeWatch[];

          break;

        default:
          break;
      }

      if (currMediaInfo) {
        if (lastEpisodeWatchedNumber) {
          const isRedirectingToNextEpisode = findNextEpisode({
            episodes: currMediaInfo,
          });

          if (isRedirectingToNextEpisode) return;
        } else {
          setEpisodeId(
            (currMediaInfo[0] as EpisodeAnimeWatch)?.episodeId ||
              (currMediaInfo[0] as GogoanimeMediaEpisodes)?.id ||
              null
          );
        }
      }

      setIsLoading(false);

      return;
    }

    let currMediaEpisodes: GogoanimeMediaEpisodes[] | EpisodeAnimeWatch[] =
      (await fetchOnConsumet({ source: "zoro" })) as GogoanimeMediaEpisodes[];

    if (!currMediaEpisodes)
      currMediaEpisodes = (await fetchOnAniWatch()) as EpisodeAnimeWatch[]; // High chances of getting the wrong media

    if (!currMediaEpisodes) {
      setIsLoading(false);
      setEpisodeId(null);

      return;
    }

    // if user has watched a episode and the episode is NOT the last, redirects to the next episode
    if (
      lastEpisodeWatchedNumber &&
      currMediaEpisodes.length > lastEpisodeWatchedNumber
    ) {
      // adds 1 to get the next episode after the last watched
      const isRedirectingToNextEpisode = findNextEpisode({
        episodes: currMediaEpisodes,
      });

      if (isRedirectingToNextEpisode) return;
    }

    if (currMediaEpisodes)
      setEpisodeId(
        (currMediaEpisodes[0] as EpisodeAnimeWatch)?.episodeId ||
          (currMediaEpisodes[0] as GogoanimeMediaEpisodes)?.id ||
          null
      );

    setIsLoading(false);
  }

  function handlePlayBtn() {
    setIsLoading(true);

    const isDub =
      typeof window !== "undefined"
        ? localStorage.getItem("dubEpisodes") == "true"
        : false;

    const mediaPathname = `/watch/${mediaId}?source=${sourceName}&episode=${episodeNumber || 1}&q=${episodeId}${episodeNumber ? `&t=${episodeLastStop || 0}` : ""}${isDub ? "&dub=true" : ""}`;

    router.push(mediaPathname);
  }

  return (
    <React.Fragment>
      <li className={`${pageStyles.info_item} ${pageStyles.action_btn}`}>
        <motion.button
          id={styles.container}
          role="link"
          onClick={() => handlePlayBtn()}
          disabled={isLoading || episodeId == null}
          aria-label={
            episodeNumber
              ? `Continue Episode ${episodeNumber}`
              : "Watch Episode 1"
          }
          title={
            isLoading
              ? "Loading"
              : episodeId == null
                ? "Not Available At This Moment"
                : `Watch ${episodeNumber ? `Episode ${episodeNumber} - ${mediaTitle} ` : mediaTitle}`
          }
        >
          <ProgressBar
            episodeDuration={episodeDuration}
            episodeLastStop={episodeLastStop}
          />

          <EpisodeNumber
            user={user || anilistUser}
            episodeNumber={episodeNumber}
            mediaFormat={mediaFormat}
          />

          {isLoading ? (
            <LoadingSvg fill="#fff" width={16} height={16} />
          ) : (
            <PlaySvg fill="#fff" width={16} height={16} />
          )}

          <SourceName movieId={episodeId} sourceName={sourceName} />
        </motion.button>
      </li>

      {mediaFormat == "MOVIE" && (
        <li className={`${pageStyles.info_item}`}>
          <h2>MOVIE</h2>

          <div id={styles.movie_options_settings_container}>
            <DubbedCheckboxButton
              isDubActive={isDubbedActive}
              clickAction={() => setIsDubbedActive(!isDubbedActive)}
              styleRow
            />

            <AnimatePresence>
              {sourceName && (
                <motion.label
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                >
                  Source
                  <select
                    defaultValue={sourceName}
                    onChange={(e) =>
                      setSourceName(e.target.value as SourceType["source"])
                    }
                  >
                    {sourcesAvailable.map((source) => (
                      <option value={source.value} key={source.value}>
                        {source.name}
                      </option>
                    ))}
                  </select>
                </motion.label>
              )}
            </AnimatePresence>
          </div>
        </li>
      )}
    </React.Fragment>
  );
}

function ProgressBar({
  episodeLastStop,
  episodeDuration,
}: {
  episodeLastStop: number | undefined;
  episodeDuration: number | undefined;
}) {
  const isActive = episodeLastStop && episodeDuration ? true : false;

  return (
    isActive && (
      <motion.div className={styles.progress_bar}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: ((episodeLastStop! / episodeDuration!) * 100) / 100 || 0.07,
          }}
          transition={{ duration: 1 }}
        />
      </motion.div>
    )
  );
}

function EpisodeNumber({
  user,
  episodeNumber,
  mediaFormat,
}: {
  user: User | UserAnilist | null | undefined;
  mediaFormat: string;
  episodeNumber: number | undefined;
}) {
  return (
    user &&
    episodeNumber &&
    (mediaFormat == "MOVIE" ? (
      <span id={styles.continue_span}>CONTINUE</span>
    ) : (
      <span id={styles.continue_span}>EPISODE {episodeNumber}</span>
    ))
  );
}

function SourceName({
  movieId,
  sourceName,
}: {
  movieId: string | null;
  sourceName: string | undefined;
}) {
  return (
    movieId &&
    sourceName && (
      <span id={styles.source_span}>{sourceName.toUpperCase()} (IN BETA)</span>
    )
  );
}
