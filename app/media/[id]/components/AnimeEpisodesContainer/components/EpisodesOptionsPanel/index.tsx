import anilistUsers from "@/app/api/anilist/anilistUsers";
import styles from "../../component.module.css";
import {
  MediaData,
  MediaDataFullInfo,
} from "@/app/ts/interfaces/anilistMediaData";
import { ImdbMediaInfo, ImdbEpisode } from "@/app/ts/interfaces/imdb";
import { Firestore, getDoc, doc, setDoc, FieldPath } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import DubbedCheckboxButton from "../ActiveDubbButton";
import DotsSvg from "@/public/assets/three-dots-vertical.svg";
import CheckFillSvg from "@/public/assets/check-circle-fill.svg";
import { useAppDispatch } from "@/app/lib/redux/hooks";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";

export default function EpisodesOptionsPanel({
  userId,
  isAnilistUser,
  db,
  mediaInfo,
  imdb,
  callDubbedFunction,
  dubbedStateValue,
}: {
  userId: string | undefined;
  db: Firestore;
  isAnilistUser: boolean;
  imdb: {
    mediaSeasons: ImdbMediaInfo["seasons"];
    episodesList: ImdbEpisode[];
  };
  mediaInfo: MediaData | MediaDataFullInfo;
  callDubbedFunction: () => void;
  dubbedStateValue: boolean;
}) {
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false);
  const [allEpisodesWatched, setAllEpisodesWatched] = useState<boolean>(false);

  const [isDubActive, setIsDubActive] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsDubActive(dubbedStateValue);
  }, [dubbedStateValue]);

  async function toggleOpenOptionsModal() {
    setIsOptionsModalOpen(!isOptionsModalOpen);

    if (!userId) return;

    const userDoc = await getDoc(doc(db, "users", userId)).then((res) =>
      res.data()
    );

    if (
      userDoc!.episodesWatched[mediaInfo.id]?.length ==
      imdb.episodesList?.length
    ) {
      setAllEpisodesWatched(true);

      return;
    }

    setAllEpisodesWatched(false);
  }

  async function handleMarkAllEpisodesAsWatched() {
    if (!userId) return dispatch(toggleShowLoginModalValue());

    function mapAllEpisodesInfo(index: number) {
      return {
        mediaId: mediaInfo.id,
        episodeNumber: index + 1,
        episodeTitle: imdb.episodesList[index]?.title,
      };
    }

    const allEpisodes: {
      mediaId: number;
      episodeNumber: number;
      episodeTitle: string;
    }[] = [];

    imdb.episodesList.map((episode, key) =>
      allEpisodes.push(mapAllEpisodesInfo(key))
    );

    await setDoc(
      doc(db, "users", userId),
      {
        episodesWatched: {
          [mediaInfo.id]: allEpisodesWatched ? null : allEpisodes,
        },
      } as unknown as FieldPath,
      { merge: true }
    ).then(async () => {
      if (isAnilistUser) {
        await anilistUsers.addMediaToSelectedList({
          mediaId: mediaInfo.id,
          status: allEpisodesWatched ? "PAUSED" : "COMPLETED",
          episodeOrChapterNumber: allEpisodesWatched
            ? 0
            : mediaInfo.episodes || 0,
        });
      }

      setAllEpisodesWatched(!allEpisodesWatched);
    });
  }

  return (
    <div id={styles.option_container}>
      <DubbedCheckboxButton
        isDubActive={isDubActive}
        clickAction={() => callDubbedFunction()}
      />

      {userId && (
        <button
          id={styles.options_btn}
          onClick={() => toggleOpenOptionsModal()}
          data-active={isOptionsModalOpen}
          aria-controls={styles.episodes_options_panel}
          aria-label={
            isOptionsModalOpen ? `Close Options Menu` : `Open Options Menu`
          }
        >
          <DotsSvg width={16} height={16} />
        </button>
      )}

      <AnimatePresence>
        {isOptionsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id={styles.episodes_options_panel}
            aria-expanded={isOptionsModalOpen}
            className={styles.options_modal_container}
          >
            <h5>OPTIONS</h5>

            <ul>
              <li>
                <motion.button
                  onClick={() => handleMarkAllEpisodesAsWatched()}
                  whileTap={{ scale: 0.9 }}
                >
                  <CheckFillSvg width={16} height={16} />{" "}
                  {allEpisodesWatched ? "Unmark" : "Mark"} all episodes as
                  watched
                </motion.button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
