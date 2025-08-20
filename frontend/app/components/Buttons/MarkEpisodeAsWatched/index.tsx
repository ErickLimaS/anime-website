"use client";
import React, { useEffect, useState } from "react";
import CheckSvg from "@/public/assets/check-circle.svg";
import CheckFillSvg from "@/public/assets/check-circle-fill.svg";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  FieldPath,
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import styles from "./component.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/app/lib/redux/hooks";
import anilistUsers from "@/app/api/anilist/anilistUsers";

type BtnTypes = {
  episodeNumber: number;
  episodeTitle: string;
  mediaId: number;
  maxEpisodesNumber?: number;
  showAdditionalText?: boolean;
  wasWatched?: boolean;
};

export default function MarkEpisodeAsWatchedButton({
  episodeNumber,
  episodeTitle,
  mediaId,
  wasWatched,
  maxEpisodesNumber,
  showAdditionalText,
}: BtnTypes) {
  const [wasEpisodeWatched, setWasEpisodeWatched] = useState<boolean>(
    wasWatched || false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();

  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    setWasEpisodeWatched(wasWatched || false);
  }, [wasWatched]);

  async function handleEpisodeWatchedAction() {
    if (!user && !anilistUser) return;

    setIsLoading(true);

    const animesEpisodeInfo = {
      mediaId: mediaId,
      episodeNumber: episodeNumber,
      episodeTitle: episodeTitle,
    };

    await setDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`),
      {
        episodesWatched: {
          [mediaId]: wasEpisodeWatched
            ? arrayRemove(...[animesEpisodeInfo])
            : arrayUnion(...[animesEpisodeInfo]),
        },
      } as unknown as FieldPath,
      { merge: true }
    ).then(async () => {
      if (anilistUser) {
        await anilistUsers.addMediaToSelectedList({
          mediaId: mediaId,
          status: maxEpisodesNumber == episodeNumber ? "COMPLETED" : "CURRENT",
          episodeOrChapterNumber: wasEpisodeWatched
            ? episodeNumber - 1
            : episodeNumber,
        });
      }

      setWasEpisodeWatched(!wasEpisodeWatched);
    });

    setIsLoading(false);
  }

  return (
    (user || anilistUser) && (
      <div className={styles.button_container}>
        <motion.button
          onClick={() => handleEpisodeWatchedAction()}
          data-active={wasEpisodeWatched}
          disabled={isLoading}
          title={wasEpisodeWatched ? "Mark as Unwatched " : "Mark as Watched"}
        >
          <SvgIcons wasEpisodeWatched={wasEpisodeWatched} />
        </motion.button>

        <AuxTextAnimated
          wasEpisodeWatched={wasEpisodeWatched}
          showAdditionalText={showAdditionalText}
        />
      </div>
    )
  );
}

function SvgIcons({ wasEpisodeWatched }: { wasEpisodeWatched: boolean }) {
  if (wasEpisodeWatched) {
    return (
      <CheckFillSvg width={16} height={16} alt="Check Episode as Watched" />
    );
  }

  return <CheckSvg width={16} height={16} alt="Check Episode as Not Watched" />;
}

function AuxTextAnimated({
  showAdditionalText,
  wasEpisodeWatched,
}: {
  wasEpisodeWatched: boolean;
  showAdditionalText?: boolean;
}) {
  return (
    <AnimatePresence>
      {showAdditionalText && wasEpisodeWatched && (
        <motion.span
          className={styles.text_span}
          initial={{ opacity: 0, y: "10px" }}
          animate={{ opacity: 1, y: "0", transition: { duration: 0.2 } }}
          exit={{ opacity: 0, y: "10px" }}
        >
          Watched
        </motion.span>
      )}
    </AnimatePresence>
  );
}
