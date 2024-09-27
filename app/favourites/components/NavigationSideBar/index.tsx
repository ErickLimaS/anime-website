"use client";
import Link from "next/link";
import React, { useLayoutEffect, useState } from "react";
import styles from "./component.module.css";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { useAppSelector } from "@/app/lib/redux/hooks";
import { BookmarkItem } from "@/app/ts/interfaces/firestoreData";

function NavigationSideBar({ params }: { params?: { format: string } }) {
  const [currParams, setCurrParams] = useState("");
  const [bookmarksMediaTypesQuantity, setBookmarksMediaTypesQuantity] =
    useState<{ all: number; anime: number; manga: number; movie: number }>();

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useLayoutEffect(() => {
    if (!loading && (user || anilistUser)) getUserBookmarks();

    setCurrParams(params?.format || "");
  }, [loading, params]);

  async function getUserBookmarks() {
    const bookmarksList: BookmarkItem[] = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    ).then((doc) => doc.get("bookmarks"));

    setBookmarksMediaTypesQuantity({
      all: bookmarksList.length,
      anime: bookmarksList.filter((media) => media.format == "TV").length,
      manga: bookmarksList.filter((media) => media.format == "MANGA").length,
      movie: bookmarksList.filter((media) => media.format == "MOVIE").length,
    });
  }

  return (
    <React.Fragment>
      <p>FORMAT</p>

      <nav id={styles.nav_container}>
        <ul>
          <li data-active={currParams == ""}>
            <Link href={`/favourites`}>
              All{" "}
              {bookmarksMediaTypesQuantity && (
                <span>({bookmarksMediaTypesQuantity.all})</span>
              )}
            </Link>
          </li>
          <li data-active={currParams == "tv"}>
            <Link href={`?format=tv`}>
              Animes{" "}
              {bookmarksMediaTypesQuantity && (
                <span>({bookmarksMediaTypesQuantity.anime})</span>
              )}
            </Link>
          </li>
          <li data-active={currParams == "manga"}>
            <Link href={`?format=manga`}>
              Mangas{" "}
              {bookmarksMediaTypesQuantity && (
                <span>({bookmarksMediaTypesQuantity.manga})</span>
              )}
            </Link>
          </li>
          <li data-active={currParams == "movie"}>
            <Link href={`?format=movie`}>
              Movies{" "}
              {bookmarksMediaTypesQuantity && (
                <span>({bookmarksMediaTypesQuantity.movie})</span>
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
}

export default NavigationSideBar;
