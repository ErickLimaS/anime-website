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
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import styles from "./component.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/app/lib/redux/hooks";
import anilistUsers from "@/app/api/anilist/anilistUsers";

type BtnTypes = {
  chapterNumber: number;
  chapterTitle: string;
  mediaId: number;
  showAdditionalText?: boolean;
  wasChapterReadOnAnilist?: boolean;
  maxChaptersNumber?: number;
};

export default function MarkChapterAsReadButton({
  chapterNumber,
  chapterTitle,
  mediaId,
  showAdditionalText,
  wasChapterReadOnAnilist,
  maxChaptersNumber,
}: BtnTypes) {
  const [wasChapterRead, setWasChapterRead] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();

  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (!user && !anilistUser) return;

    wasChapterPreviouslyMarkedAsRead();
  }, [user, anilistUser, chapterNumber]);

  async function wasChapterPreviouslyMarkedAsRead() {
    if (wasChapterReadOnAnilist)
      return setWasChapterRead(wasChapterReadOnAnilist);

    if (!user && !anilistUser) return;

    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const chapterRead = userDoc
      .get("chaptersRead")
      [mediaId]?.find(
        (item: { chapterNumber: number }) => item.chapterNumber == chapterNumber
      );

    if (chapterRead) setWasChapterRead(true);
  }

  async function handleChapterReadAction() {
    if (!user && !anilistUser) return;

    setIsLoading(true);

    const mangaChapterInfo = {
      mediaId: mediaId,
      chapterNumber: chapterNumber,
      chapterTitle: chapterTitle,
    };

    await setDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`),
      {
        chaptersRead: {
          [mediaId]: !wasChapterRead
            ? arrayUnion(...[mangaChapterInfo])
            : arrayRemove(...[mangaChapterInfo]),
        },
      } as unknown as FieldPath,
      { merge: true }
    ).then(async () => {
      if (anilistUser) {
        await anilistUsers.addMediaToSelectedList({
          mediaId: mediaId,
          status: maxChaptersNumber == chapterNumber ? "COMPLETED" : "CURRENT",
          episodeOrChapterNumber: wasChapterRead
            ? chapterNumber - 1
            : chapterNumber,
        });
      }

      setWasChapterRead(!wasChapterRead);
    });

    setIsLoading(false);
  }

  return (
    (user || anilistUser) && (
      <div className={styles.button_container}>
        <motion.button
          onClick={() => handleChapterReadAction()}
          data-active={wasChapterRead}
          disabled={isLoading}
          title={wasChapterRead ? "Mark as Unread" : "Mark as Read"}
        >
          <SvgIcons wasChapterRead={wasChapterRead} />
        </motion.button>

        <AuxTextAnimated
          wasChapterRead={wasChapterRead}
          showAdditionalText={showAdditionalText}
        />
      </div>
    )
  );
}

function SvgIcons({ wasChapterRead }: { wasChapterRead: boolean }) {
  if (wasChapterRead) {
    return <CheckFillSvg width={16} height={16} alt="Check Chapter as Read" />;
  }

  return <CheckSvg width={16} height={16} alt="Check Chapter as Unread" />;
}

function AuxTextAnimated({
  showAdditionalText,
  wasChapterRead,
}: {
  wasChapterRead: boolean;
  showAdditionalText?: boolean;
}) {
  return (
    <AnimatePresence>
      {showAdditionalText && wasChapterRead && (
        <motion.span
          className={styles.text_span}
          initial={{ opacity: 0, y: "10px" }}
          animate={{ opacity: 1, y: "0", transition: { duration: 0.2 } }}
          exit={{ opacity: 0, y: "10px" }}
        >
          Read
        </motion.span>
      )}
    </AnimatePresence>
  );
}
