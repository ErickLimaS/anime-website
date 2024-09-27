"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg";
import BellFillSvg from "@/public/assets/bell-fill.svg";
import BellSvg from "@/public/assets/bell-slash.svg";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  FieldPath,
  setDoc,
  collection,
  deleteDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { getAuth } from "firebase/auth";
import {
  MediaData,
  MediaDataFullInfo,
} from "@/app/ts/interfaces/anilistMediaData";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";

function AddToNotificationsButton({
  mediaInfo,
}: {
  mediaInfo: MediaData | MediaDataFullInfo;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wasAddedToNotifications, setWasAddedToNotifications] =
    useState<boolean>(false);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);
  const dispatch = useAppDispatch();

  const auth = getAuth();

  const [user, loading] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (!loading) {
      isUserAssignedToThisMediaNotications();
    }
  }, [user, anilistUser, loading]);

  const isMediaStillReleasing = mediaInfo.nextAiringEpisode?.airingAt ?? false;

  async function handleMediaOnNotifications() {
    if (!user && !anilistUser) return dispatch(toggleShowLoginModalValue());

    setIsLoading(true);

    const mediaNotificationDoc = await getDoc(
      doc(db, "notifications", `${mediaInfo.id}`)
    );

    // compare last Update with additional 30 minutes with the current time. If TRUE, fetchs Notifications again
    function isCurrDateBiggerThanRelease(release: number) {
      const dateNow = Number((new Date().getTime() / 1000).toFixed(0));
      const releaseDate = release || 0;

      return dateNow >= releaseDate;
    }

    if (wasAddedToNotifications) {
      // remove user from list to be notified
      await deleteDoc(
        doc(
          db,
          "notifications",
          `${mediaInfo.id}`,
          "usersAssigned",
          user?.uid || `${anilistUser?.id}`
        )
      );

      // add Media Id to Notifications on User DOC
      await updateDoc(
        doc(db, "users", user?.uid || `${anilistUser?.id}`),
        {
          notifications: arrayRemove(
            ...[
              {
                lastEpisodeNotified:
                  mediaInfo.nextAiringEpisode?.episode == 1
                    ? mediaInfo.nextAiringEpisode?.episode
                    : mediaInfo.nextAiringEpisode?.episode - 1,
                mediaId: mediaInfo.id,
                title: {
                  romaji: mediaInfo.title.romaji,
                  native: mediaInfo.title.native,
                },
              },
            ]
          ),
        } as unknown as FieldPath,
        { merge: true }
      );

      setWasAddedToNotifications(!wasAddedToNotifications ? true : false);

      setIsLoading(false);

      return;
    }

    if (mediaNotificationDoc.exists() == false) {
      const mediaNotificationInfo = {
        mediaId: `${mediaInfo.id}`,
        lastUpdate: Number((new Date().getTime() / 1000).toFixed(0)),
        coverImage: {
          extraLarge: mediaInfo.coverImage.extraLarge,
          large: mediaInfo.coverImage.large,
        },
        title: {
          romaji: mediaInfo.title.romaji,
          native: mediaInfo.title.native,
        },
        nextReleaseDate: mediaInfo.nextAiringEpisode?.airingAt || null,
        status: mediaInfo.status,
        isComplete: mediaInfo.status == "FINISHED",
        episodes: [
          {
            releaseDate: mediaInfo.nextAiringEpisode?.airingAt || null,
            number: mediaInfo.nextAiringEpisode?.episode,
            wasReleased: isCurrDateBiggerThanRelease(
              mediaInfo.nextAiringEpisode?.airingAt
            ),
          },
        ],
      };

      // Add Media to Notifications Collection
      await setDoc(
        doc(db, "notifications", `${mediaInfo.id}`),
        mediaNotificationInfo
      );

      // Assign User to This Media Notifications
      await setDoc(
        doc(
          db,
          "notifications",
          `${mediaInfo.id}`,
          "usersAssigned",
          user?.uid || `${anilistUser?.id}`
        ),
        {
          userRef: user?.uid || `${anilistUser?.id}`,
        }
      );
    } else {
      const mediaInfoDoc = mediaNotificationDoc.data();

      const mediaEpisodes = mediaInfoDoc.episodes.sort(
        (a: { number: number }, b: { number: number }) => a.number - b.number
      );

      if (
        isCurrDateBiggerThanRelease(
          mediaEpisodes[mediaEpisodes.length - 1].releaseDate
        )
      ) {
        mediaEpisodes[mediaEpisodes.length - 1].wasReleased =
          isCurrDateBiggerThanRelease(
            mediaEpisodes[mediaEpisodes.length - 1].releaseDate
          );

        if (mediaInfo.status != "FINISHED") {
          mediaEpisodes.push({
            releaseDate: mediaInfo.nextAiringEpisode?.airingAt || null,
            number: mediaInfo.nextAiringEpisode?.episode,
            wasReleased: isCurrDateBiggerThanRelease(
              mediaInfo.nextAiringEpisode?.airingAt
            ),
          });
        }

        mediaEpisodes.nextReleaseDate =
          mediaInfo.nextAiringEpisode?.airingAt || null;
        mediaEpisodes.episodes = mediaEpisodes;

        // Add Media to Notifications Collection
        await updateDoc(
          doc(db, "notifications", `${mediaInfo.id}`),
          mediaInfoDoc
        );
      }

      // Assign User to This Media Notifications
      await setDoc(
        doc(
          db,
          "notifications",
          `${mediaInfo.id}`,
          "usersAssigned",
          user?.uid || `${anilistUser?.id}`
        ),
        {
          userRef: user?.uid || `${anilistUser?.id}`,
        }
      );
    }

    // Add Default Media Info to User Doc, so it keep track of which episode was last notified
    await updateDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`),
      {
        notifications: arrayUnion(
          ...[
            {
              lastEpisodeNotified:
                mediaInfo.nextAiringEpisode?.episode == 1
                  ? mediaInfo.nextAiringEpisode?.episode
                  : mediaInfo.nextAiringEpisode?.episode - 1,
              mediaId: mediaInfo.id,
              title: {
                romaji: mediaInfo.title.romaji,
                native: mediaInfo.title.native,
              },
            },
          ]
        ),
      } as unknown as FieldPath,
      { merge: true }
    );

    setWasAddedToNotifications(!wasAddedToNotifications ? true : false);

    setIsLoading(false);
  }

  async function isUserAssignedToThisMediaNotications() {
    if (!user && !anilistUser) return setWasAddedToNotifications(false);

    const userAssignedNoticationsList = await getDoc(
      doc(db, "notifications", `${mediaInfo.id}`)
    );

    if (userAssignedNoticationsList.exists() == false)
      return setWasAddedToNotifications(false);

    setIsLoading(true);

    const mediaOnUserNotifications = query(
      collection(db, "notifications", `${mediaInfo.id}`, "usersAssigned"),
      where("userRef", "==", `${user?.uid}` || `${anilistUser?.id}`)
    );

    const mediaNotificationDoc = await getDocs(mediaOnUserNotifications);

    if (mediaNotificationDoc.size == 1) {
      // IF SIZE EQUALS 1, MEANS USER EXISTS AND IS ASSIGNED
      setWasAddedToNotifications(true);
    } else {
      setWasAddedToNotifications(false);
    }

    setIsLoading(false);

    return;
  }

  if (isMediaStillReleasing) {
    return (
      <motion.button
        whileTap={{ scale: 0.85 }}
        id={styles.container}
        onClick={() => handleMediaOnNotifications()}
        disabled={isLoading}
        data-added={wasAddedToNotifications}
        title={
          wasAddedToNotifications
            ? `Remove ${mediaInfo.title && mediaInfo.title?.userPreferred} From Notifications`
            : `Get Notified When ${mediaInfo.title && mediaInfo.title?.userPreferred} Get a New Episode`
        }
      >
        {isLoading && <LoadingSvg alt="Loading Icon" width={16} height={16} />}

        {!isLoading &&
          (wasAddedToNotifications ? (
            <BellFillSvg width={16} height={16} />
          ) : (
            <BellSvg width={16} height={16} />
          ))}
      </motion.button>
    );
  }
}

export default AddToNotificationsButton;
