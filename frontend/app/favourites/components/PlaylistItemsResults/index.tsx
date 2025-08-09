"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import * as MediaCard from "@/app/components/MediaCards/MediaCard";
import SvgLoading from "@/public/assets/Eclipse-1s-200px.svg";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import { BookmarkItem } from "@/app/ts/interfaces/firestoreData";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";

function PlaylistItemsResults({
  params,
}: {
  params?: { format: string; sort: "title_desc" | "title_asc" };
}) {
  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const [userBookmarksList, setUserBookmarksList] = useState<BookmarkItem[]>(
    []
  );
  const [userFilteredBookmarks, setUserFilteredBookmarks] = useState<
    BookmarkItem[]
  >([]);

  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();

  useEffect(() => {
    setUserFilteredBookmarks([]);
  }, [searchParams.size == 0]);

  useEffect(() => {
    if (user || anilistUser) getUserBookmarksList();
  }, [user, anilistUser]);

  useEffect(() => {
    if (!user && !anilistUser && !loading)
      dispatch(toggleShowLoginModalValue());
  }, [user, anilistUser, loading]);

  useEffect(() => {
    if (params?.format) {
      const filteredBookmarks = userBookmarksList.filter(
        (media) => media.format == params!.format.toUpperCase()
      );

      setUserFilteredBookmarks(filteredBookmarks);
    }
  }, [params?.format]);

  useEffect(() => {
    let filteredBookmarks = !params?.format
      ? userBookmarksList
      : userFilteredBookmarks;

    if (params?.sort) {
      if (params.sort == "title_desc")
        filteredBookmarks = filteredBookmarks.sort((a, b) =>
          a.title.userPreferred > b.title.userPreferred ? -1 : 1
        );
      else if (params.sort == "title_asc")
        filteredBookmarks = filteredBookmarks
          .sort((a, b) =>
            a.title.userPreferred > b.title.userPreferred ? -1 : 1
          )
          .reverse();
    }

    setUserFilteredBookmarks(filteredBookmarks);
  }, [params?.sort]);

  async function getUserBookmarksList() {
    const db = getFirestore(initFirebase());

    const bookmarksList: BookmarkItem[] = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    ).then((doc) => doc.get("bookmarks"));

    if (!params) {
      setUserFilteredBookmarks([]);
      setUserBookmarksList(bookmarksList);

      return;
    }

    let filteredBookmarks = bookmarksList;

    if (params?.format)
      filteredBookmarks = filteredBookmarks.filter(
        (item) => item.format == params.format.toUpperCase()
      );

    if (params?.sort) {
      if (params.sort == "title_desc")
        filteredBookmarks = filteredBookmarks.sort((a, b) =>
          a.title.romaji > b.title.romaji ? -1 : 1
        );
      else if (params.sort == "title_asc")
        filteredBookmarks = filteredBookmarks
          .sort((a, b) => (a.title.romaji > b.title.romaji ? -1 : 1))
          .reverse();
    }

    setUserFilteredBookmarks(filteredBookmarks);
    setUserBookmarksList(bookmarksList);
  }

  return (
    <React.Fragment>
      {loading && (
        <div style={{ height: "400px", width: "100%", display: "flex" }}>
          <SvgLoading width={120} height={120} style={{ margin: "auto" }} />
        </div>
      )}

      {!loading && (
        <div id={styles.container}>
          <ul>
            {(userFilteredBookmarks.length == 0 ||
              userBookmarksList?.length == 0) && (
              <p className={styles.no_results_text}>No Results</p>
            )}

            {params
              ? userFilteredBookmarks.length > 0 &&
                userFilteredBookmarks.map((media, key) => (
                  <li key={key}>
                    <MediaCard.Container onDarkMode>
                      <MediaCard.MediaImgLink
                        hideOptionsButton
                        mediaInfo={media as MediaData}
                        mediaId={media.id}
                        title={media.title.userPreferred}
                        formatOrType={media.format}
                        url={media.coverImage.extraLarge}
                      />

                      <MediaCard.LinkTitle
                        title={media.title.userPreferred}
                        id={media.id}
                      />
                    </MediaCard.Container>
                  </li>
                ))
              : userBookmarksList.map((media, key) => (
                <li key={key}>
                  <MediaCard.Container onDarkMode>
                    <MediaCard.MediaImgLink
                      hideOptionsButton
                      mediaInfo={media as MediaData}
                      mediaId={media.id}
                      title={media.title.userPreferred}
                      formatOrType={media.format}
                      url={media.coverImage.extraLarge}
                    />

                    <MediaCard.LinkTitle
                      title={media.title.userPreferred}
                      id={media.id}
                    />
                  </MediaCard.Container>
                </li>
              ))}
          </ul>
        </div>
      )}
    </React.Fragment>
  );
}

export default PlaylistItemsResults;
