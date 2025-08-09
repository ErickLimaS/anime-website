"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg";
import FavouriteSvg from "@/public/assets/heart.svg";
import FavouriteFillSvg from "@/public/assets/heart-fill.svg";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { getAuth } from "firebase/auth";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import { updateUserFavouriteMedias } from "@/app/lib/user/userDocUpdateOptions";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import anilistUsers from "@/app/api/anilist/anilistUsers";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";
import { KeepWatchingMediaData } from "@/app/ts/interfaces/firestoreData";
import { MediaOnJSONFile } from "@/app/ts/interfaces/jsonMediaData";

export function Button({
  mediaInfo,
  children,
  svgOnlyColor,
  isActiveOnAnilist,
  customText,
}: {
  mediaInfo: MediaData | MediaOnJSONFile | KeepWatchingMediaData;
  children?: React.ReactNode[];
  svgOnlyColor?: string;
  isActiveOnAnilist?: boolean;
  customText?: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wasAddedToFavourites, setWasAddedToFavourites] = useState<boolean>(
    isActiveOnAnilist || false
  );

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const dispatch = useAppDispatch();

  const auth = getAuth();

  const [user, loading] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (!loading) {
      isMediaOnUserDoc();
    }
  }, [user, anilistUser, loading]);

  // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
  async function handleMediaOnFavourites() {
    // Opens Login Modal
    if (!user && !anilistUser) return dispatch(toggleShowLoginModalValue());

    setIsLoading(true);

    const favouriteMediaData = {
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

    await updateUserFavouriteMedias({
      userId: user?.uid || `${anilistUser?.id}`,
      mediaData: favouriteMediaData,
      isAddAction: !wasAddedToFavourites,
    });

    await anilistUsers.addOrRemoveFromAnilistFavourites({
      format: mediaInfo.type.toLowerCase() as "anime" | "manga",
      mediaId: mediaInfo.id,
    });

    setWasAddedToFavourites(wasAddedToFavourites ? true : false);

    setIsLoading(false);
  }

  // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
  async function isMediaOnUserDoc() {
    if (!user && !anilistUser) return;

    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    );

    const wasMediaIdFoundOnDoc = userDoc
      .get("bookmarks")
      ?.find((item: { id: number }) => item.id == mediaInfo.id);

    if (wasMediaIdFoundOnDoc) setWasAddedToFavourites(true);
  }

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      id={styles.container}
      className={children ? styles.custom_text : ""}
      onClick={() => handleMediaOnFavourites()}
      disabled={isLoading}
      data-added={wasAddedToFavourites}
      data-unique-color={svgOnlyColor != undefined}
      aria-label={
        wasAddedToFavourites
          ? "Click To Remove from Favourites"
          : "Click To Add To Favourites"
      }
      title={
        wasAddedToFavourites
          ? `Remove ${
            mediaInfo.title && mediaInfo.title?.userPreferred
          } from Favourites`
          : `Add ${
            mediaInfo.title && mediaInfo.title?.userPreferred
          } To Favourites`
      }
    >
      {isLoading && <LoadingSvg alt="Loading Icon" width={16} height={16} />}

      {!isLoading &&
        wasAddedToFavourites &&
        (children ? (
          children[1]
        ) : (
          <>
            <FavouriteFillSvg
              width={16}
              height={16}
              fill={svgOnlyColor || "var(--brand-color)"}
            />{" "}
            FAVOURITED
          </>
        ))}

      {!isLoading &&
        !wasAddedToFavourites &&
        (children ? (
          children[0]
        ) : (
          <>
            <FavouriteSvg
              width={16}
              height={16}
              fill={svgOnlyColor || "var(--white-100)"}
            />{" "}
            FAVOURITE
          </>
        ))}

      {customText || ""}
    </motion.button>
  );
}

export function SvgIcon({ children }: { children: React.ReactNode }) {
  return children;
}
