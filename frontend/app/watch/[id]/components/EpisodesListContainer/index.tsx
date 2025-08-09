"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import { GogoanimeMediaEpisodes } from "@/app/ts/interfaces/gogoanimeData";
import Link from "next/link";
import MarkEpisodeAsWatchedButton from "@/app/components/Buttons/MarkEpisodeAsWatched";
import { EpisodeAnimeWatch } from "@/app/ts/interfaces/aniwatchData";
import { motion } from "framer-motion";
import { ImdbEpisode } from "@/app/ts/interfaces/imdb";
import { SourceType } from "@/app/ts/interfaces/episodesSource";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { convertFromUnix } from "@/app/lib/formatDateUnix";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/lib/redux/hooks";

type ComponentTypes = {
  sourceName: SourceType["source"];
  mediaId: number;
  activeEpisodeNumber: number;
  episodesList: GogoanimeMediaEpisodes[] | EpisodeAnimeWatch[] | ImdbEpisode[];
  episodesListOnImdb: ImdbEpisode[] | undefined;
  nextAiringEpisodeInfo?: { episode: number; airingAt: number };
  anilistLastEpisodeWatched?: number;
};

export default function EpisodesListContainer({
  sourceName,
  mediaId,
  activeEpisodeNumber,
  episodesList,
  nextAiringEpisodeInfo,
  episodesListOnImdb,
  anilistLastEpisodeWatched,
}: ComponentTypes) {
  const [episodesWatchedList, setEpisodesWatchedList] = useState<
    {
      mediaId: number;
      episodeNumber: number;
      episodeTitle: string;
    }[]
  >();

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  const searchParams = useSearchParams();

  useEffect(() => {
    if (user || anilistUser) getEpisodesWatchedList();
  }, [user, anilistUser, mediaId, sourceName]);

  useEffect(() => {
    function centerActiveListItemEpisode() {
      const elementActive = document.querySelector("li[data-active=true]");

      elementActive?.scrollIntoView();

      window.scrollTo({ top: 0, behavior: "instant" });
    }

    setTimeout(centerActiveListItemEpisode, 2000);
  }, [activeEpisodeNumber]);

  function wasEpisodeWatched({
    listIndex,
    episodeNumber,
  }: {
    listIndex: number;
    episodeNumber: number;
  }) {
    if (anilistLastEpisodeWatched) return listIndex < anilistLastEpisodeWatched;

    const isEpisodeOnUserDoc = episodesWatchedList?.find(
      (item) => item.episodeNumber == episodeNumber
    );

    if (isEpisodeOnUserDoc) return true;

    return false;
  }

  async function getEpisodesWatchedList() {
    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const episodesWatchedList = userDoc.get("episodesWatched");

    if (!episodesWatchedList) return;

    const currMediaWatchedEpisodesList = episodesWatchedList[mediaId] || null;

    if (currMediaWatchedEpisodesList)
      setEpisodesWatchedList(currMediaWatchedEpisodesList);
  }

  function getMediaIdParamByMediaSource(
    media: EpisodeAnimeWatch | GogoanimeMediaEpisodes,
    source: SourceType["source"]
  ) {
    switch (source) {
      case "gogoanime":
        return `${(media as GogoanimeMediaEpisodes).id}${searchParams.get("dub") ? `&dub=true` : ""}`;

      case "aniwatch":
        return `${(media as EpisodeAnimeWatch).episodeId}${searchParams.get("dub") ? `&dub=true` : ""}`;

      default:
        return null;
    }
  }

  return (
    <div id={styles.episodes_list_container}>
      <div className={styles.heading_container}>
        <h3>EPISODES {searchParams.get("dub") ? "(DUB)" : ""}</h3>

        <p>on {sourceName.toUpperCase()}</p>
      </div>

      <motion.ol id={styles.list_container}>
        {episodesList?.map((episode, key) => (
          <motion.li
            key={key}
            data-active={
              (episode as GogoanimeMediaEpisodes).number == activeEpisodeNumber
            }
          >
            <Link
              title={`Episode ${(episode as GogoanimeMediaEpisodes).number}`}
              href={`/watch/${mediaId}?source=${sourceName}&episode=${(episode as GogoanimeMediaEpisodes).number}&q=${getMediaIdParamByMediaSource(episode as GogoanimeMediaEpisodes, sourceName)}`}
            >
              <div className={styles.img_container}>
                <span>{(episode as GogoanimeMediaEpisodes).number}</span>
              </div>
            </Link>

            <div className={styles.episode_info_container}>
              <Link
                href={`/watch/${mediaId}?source=${sourceName}&episode=${(episode as GogoanimeMediaEpisodes).number}&q=${getMediaIdParamByMediaSource(episode as GogoanimeMediaEpisodes, sourceName)}`}
              >
                {sourceName == "aniwatch" &&
                  (episode as EpisodeAnimeWatch).isFiller && (
                  <small className={styles.filler_alert_text}>Filler</small>
                )}

                <h4>
                  {sourceName == "gogoanime"
                    ? episodesListOnImdb
                      ? episodesListOnImdb[key].title
                      : `Episode ${(episode as GogoanimeMediaEpisodes).number}`
                    : (episode as EpisodeAnimeWatch).title}
                </h4>
              </Link>

              <MarkEpisodeAsWatchedButton
                episodeNumber={(episode as GogoanimeMediaEpisodes).number}
                episodeTitle={
                  sourceName == "aniwatch"
                    ? (episode as ImdbEpisode).title
                    : `${(episode as GogoanimeMediaEpisodes).number}`
                }
                maxEpisodesNumber={episodesList.length}
                mediaId={mediaId}
                showAdditionalText={true}
                wasWatched={wasEpisodeWatched({
                  listIndex: key,
                  episodeNumber: (episode as GogoanimeMediaEpisodes).number,
                })}
              />
            </div>
          </motion.li>
        ))}

        <NextAiringEpisodeListItem
          nextAiringEpisodeInfo={nextAiringEpisodeInfo}
          mediaId={mediaId}
        />
      </motion.ol>
    </div>
  );
}

function NextAiringEpisodeListItem({
  mediaId,
  nextAiringEpisodeInfo,
}: {
  mediaId: number;
  nextAiringEpisodeInfo?: { episode: number; airingAt: number };
}) {
  return (
    nextAiringEpisodeInfo && (
      <motion.li data-active={false} className={styles.next_episode_container}>
        <Link
          title={`Episode ${nextAiringEpisodeInfo.episode}`}
          href={`/media/${mediaId}`}
        >
          <div className={styles.img_container}>
            <span>{nextAiringEpisodeInfo.episode}</span>
          </div>
        </Link>

        <div className={styles.episode_info_container}>
          <Link href={`/media/${mediaId}`}>
            <h4>Episode {nextAiringEpisodeInfo.episode}</h4>

            <small>On {convertFromUnix(nextAiringEpisodeInfo.airingAt)}</small>
          </Link>
        </div>
      </motion.li>
    )
  );
}
