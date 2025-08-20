"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  FieldPath,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { getAuth } from "firebase/auth";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { useAuthState } from "react-firebase-hooks/auth";
import { AnimatePresence, motion } from "framer-motion";
import {
  removeMediaOnListByStatus,
  updateUserMediaListByStatus,
} from "@/app/lib/user/userDocUpdateOptions";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import anilistUsers from "@/app/api/anilist/anilistUsers";
import { ImdbEpisode } from "@/app/ts/interfaces/imdb";
import { userMediaStatusEntries } from "@/app/lib/dataConstants/anilist";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";

export function Button({
  mediaInfo,
  statusOnAnilist,
  listEntryId,
  imdbEpisodesList,
  amountWatchedOrRead,
  children,
}: {
  mediaInfo: MediaData;
  imdbEpisodesList?: ImdbEpisode[];
  statusOnAnilist?: MediaData["mediaListEntry"]["status"];
  listEntryId?: number;
  amountWatchedOrRead?: number;
  children?: React.ReactNode[];
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const [mediaStatus, setMediaStatus] = useState<
    MediaData["mediaListEntry"]["status"] | null
  >(statusOnAnilist || null);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);
  const dispatch = useAppDispatch();

  const auth = getAuth();

  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (!statusOnAnilist && user) {
      isMediaOnUserDoc();
    }
  }, [statusOnAnilist]);

  // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
  async function isMediaOnUserDoc() {
    if (!user) return;

    const userMediaLists = await getDoc(doc(db, "users", user.uid)).then(
      (res) => res.data()?.mediaListSavedByStatus
    );

    if (!userMediaLists) return;

    userMediaStatusEntries.map((btn) => {
      const wasMediaFound = userMediaLists[btn.value.toLowerCase()]?.find(
        (media: { id: number }) => media.id == mediaInfo.id
      );

      if (wasMediaFound)
        setMediaStatus(btn.value as MediaData["mediaListEntry"]["status"]);
    });
  }

  async function addToUserDocEpisodesWatched(action: "add" | "remove") {
    if (!imdbEpisodesList) return;

    function mapAllEpisodesInfo(index: number) {
      return {
        mediaId: mediaInfo.id,
        episodeNumber: index + 1,
        episodeTitle: imdbEpisodesList![index]?.title || `${index + 1}`,
      };
    }

    const allEpisodes: {
      mediaId: number;
      episodeNumber: number;
      episodeTitle: string;
    }[] = [];

    imdbEpisodesList.map((episode, key) =>
      allEpisodes.push(mapAllEpisodesInfo(key))
    );

    await setDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`),
      {
        episodesWatched: {
          [mediaInfo.id]: action == "add" ? allEpisodes : null,
        },
      } as unknown as FieldPath,
      { merge: true }
    );
  }

  async function handleAddMediaOnList({
    status,
  }: {
    status: MediaData["mediaListEntry"]["status"];
  }) {
    // Opens Login Modal
    if (!user && !anilistUser) return dispatch(toggleShowLoginModalValue());

    setIsLoading(true);

    const mediaData = {
      id: mediaInfo.id,
      title: {
        romaji: mediaInfo.title.romaji,
      },
      format: mediaInfo.format,
      description: mediaInfo.description,
      coverImage: {
        extraLarge: mediaInfo.coverImage.extraLarge,
        large: mediaInfo.coverImage.large,
      },
    };

    // Remove from curr list
    if (mediaStatus) {
      const userMediaList = await getDoc(
        doc(db, "users", user?.uid || `${anilistUser?.id}`)
      ).then(
        (res) => res.data()?.mediaListSavedByStatus[mediaStatus.toLowerCase()]
      );

      const filterNewList = userMediaList.filter(
        (media: { id: number }) => media.id != mediaInfo.id
      );

      await removeMediaOnListByStatus({
        newListFiltered: filterNewList,
        status: mediaStatus,
        userId: user?.uid || `${anilistUser?.id}`,
      });

      // Remove from anilist list
      if (anilistUser && mediaStatus?.toLowerCase() == status.toLowerCase()) {
        await anilistUsers.removeMediaFromSelectedList({
          listItemEntryId: listEntryId!,
        });

        setIsLoading(false);

        setMediaStatus(null);

        return;
      }
    }

    if (status == "COMPLETED") await addToUserDocEpisodesWatched("add");

    await updateUserMediaListByStatus({
      status: status,
      userId: user?.uid || `${anilistUser?.id}`,
      mediaData: mediaData,
    });

    if (anilistUser) {
      await anilistUsers.addMediaToSelectedList({
        status: status,
        mediaId: mediaInfo.id,
        episodeOrChapterNumber:
          status == "COMPLETED" ? mediaInfo.episodes : amountWatchedOrRead || 0,
        numberWatchedOrReadUntilNow: amountWatchedOrRead || 0,
      });
    }

    setIsLoading(false);

    setMediaStatus(status);
  }

  return (
    <React.Fragment>
      <motion.button
        whileTap={{ scale: 0.85 }}
        id={styles.container}
        className={children ? styles.custom_text : ""}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        title={isMenuOpen ? "Close List" : "Open List"}
        data-active={isMenuOpen}
        data-has-value={mediaStatus != null}
      >
        {isMenuOpen ? children![1] : children![0]}
      </motion.button>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id={styles.user_media_status_list}
            aria-expanded={isMenuOpen}
            data-is-loading={isLoading}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ul>
              {userMediaStatusEntries.map((btn) => (
                <li key={btn.value}>
                  <motion.button
                    data-active={mediaStatus == btn.value}
                    disabled={isLoading}
                    onClick={() =>
                      handleAddMediaOnList({
                        status:
                          btn.value as MediaData["mediaListEntry"]["status"],
                      })
                    }
                    whileTap={{ scale: 0.9 }}
                  >
                    Set as {btn.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

export function SvgIcon({ children }: { children: React.ReactNode }) {
  return children;
}
