"use client";
import React, { useEffect, useState } from "react";
import styles from "./component.module.css";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import * as MediaCard from "@/app/components/MediaCards/MediaCard";
import SvgLoading from "@/public/assets/Eclipse-1s-200px.svg";
import SvgCaretDown from "@/public/assets/chevron-down.svg";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import {
  KeepWatchingMediaData,
  ListItemOnMediasSaved,
} from "@/app/ts/interfaces/firestoreData";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";
import { AnimatePresence, motion } from "framer-motion";

type ComponentTypes = {
  mediaFetched:
    | {
      name: string;
      status: string;
      entries: {
        id: number;
        userId: number;
        mediaId: number;
        media: MediaData;
      }[];
    }[]
    | undefined;
  params?: {
    format: string;
    type: "tv" | "movie" | "manga";
    sort: "title_desc" | "title_asc";
  };
};

export default function MediasContainer({
  mediaFetched,
  params,
}: ComponentTypes) {
  const [keepWatchingList, setKeepWatchingList] = useState<
    KeepWatchingMediaData[]
  >([]);
  const [userLists, setUserLists] = useState<
    { name: string; medias: ListItemOnMediasSaved[] }[]
  >([]);

  const anilistUser = useAppSelector(
    (state) => state.UserInfo?.value as UserAnilist
  );

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.uid || anilistUser?.id) getUserLists();
  }, [user, anilistUser]);

  useEffect(() => {
    if (!user && !anilistUser && !loading)
      dispatch(toggleShowLoginModalValue());
  }, [user, anilistUser, loading]);

  async function getUserLists() {
    const db = getFirestore(initFirebase());
    const userDoc = await getDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`)
    ).then((doc) => doc.data());

    const keepWatchingListFromObjectToArray = Object.keys(
      userDoc!.keepWatching as []
    ).map((key) => {
      return userDoc!.keepWatching[key];
    });

    const keepWatchingList = keepWatchingListFromObjectToArray.filter(
      (item) => item.length != 0 && item
    );

    setKeepWatchingList(keepWatchingList);

    if (!anilistUser) {
      const activityLists: { name: string; medias: ListItemOnMediasSaved[] }[] =
        [];

      Object.keys(userDoc!.mediaListSavedByStatus)?.map((list) =>
        activityLists.push({
          name: list,
          medias: userDoc!.mediaListSavedByStatus[list],
        })
      );

      setUserLists(activityLists);
    }
  }

  return (
    <div id={styles.container}>
      {(params?.type == null || params?.type == "tv") && (
        <KeepWatchingListSection
          keepWatchingList={keepWatchingList}
          loading={loading}
        />
      )}

      {user &&
        userLists &&
        params?.type != "MANGA".toLowerCase() &&
        userLists.map((list) => (
          <MediasListOnUserDoc userList={list} key={list.name} />
        ))}

      {anilistUser &&
        mediaFetched &&
        mediaFetched.map((list) => (
          <MediasListOnAnilist list={list} key={list.name} />
        ))}
    </div>
  );
}

function KeepWatchingListSection({
  keepWatchingList,
  loading,
}: {
  keepWatchingList: KeepWatchingMediaData[];
  loading: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className={styles.list_container} id="keep-watching">
      <h2 onClick={() => setIsCollapsed(!isCollapsed)}>
        KEEP WATCHING
        <SvgCaretDown data-inverted={isCollapsed} />
      </h2>

      {loading && (
        <div style={{ height: "400px", width: "100%", display: "flex" }}>
          <SvgLoading width={120} height={120} style={{ margin: "auto" }} />
        </div>
      )}

      <AnimatePresence>
        {!isCollapsed && (
          <motion.ul>
            {!keepWatchingList && <li>No media in keep watching list</li>}

            {keepWatchingList?.map((media) => (
              <li key={media.id}>
                <MediaCard.Container onDarkMode>
                  <MediaCard.MediaImgLink
                    hideOptionsButton
                    mediaInfo={media}
                    mediaId={media.id}
                    title={media.title.userPreferred}
                    formatOrType={media.format}
                    url={media.coverImage.extraLarge}
                  />

                  <MediaCard.LinkTitle
                    title={media.title.romaji}
                    id={media.id}
                  />
                </MediaCard.Container>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function MediasListOnUserDoc({
  userList,
}: {
  userList: { name: string; medias: ListItemOnMediasSaved[] };
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div className={styles.list_container} id={userList.name.toLowerCase()}>
      <h2 onClick={() => setIsCollapsed(!isCollapsed)}>
        {userList.name == "current" ? "WATCHING" : userList.name.toUpperCase()}
        <SvgCaretDown data-inverted={isCollapsed} />
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.ul>
            {userList.medias.map((entrie, key) => (
              <li key={key}>
                <MediaCard.Container onDarkMode>
                  <MediaCard.MediaImgLink
                    hideOptionsButton
                    mediaInfo={entrie as MediaData}
                    mediaId={entrie.id}
                    title={entrie.title.userPreferred}
                    formatOrType={entrie.format}
                    url={entrie.coverImage.extraLarge}
                  />

                  <MediaCard.LinkTitle
                    title={entrie.title.romaji}
                    id={entrie.id}
                  />
                </MediaCard.Container>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function MediasListOnAnilist({
  list,
}: {
  list: {
    name: string;
    status: string;
    entries: {
      id: number;
      userId: number;
      mediaId: number;
      media: MediaData;
    }[];
  };
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div
      key={list.name}
      className={styles.list_container}
      id={list.status?.toLowerCase() || "custom"}
    >
      <h2 onClick={() => setIsCollapsed(!isCollapsed)}>
        {list.name.toUpperCase()}
        <SvgCaretDown data-inverted={isCollapsed} />
      </h2>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {list.entries.map((entrie, key) => (
              <li key={key}>
                <MediaCard.Container onDarkMode>
                  <MediaCard.MediaImgLink
                    mediaInfo={entrie.media as MediaData}
                    mediaId={entrie.media.id}
                    title={entrie.media.title.userPreferred}
                    formatOrType={entrie.media.format}
                    url={entrie.media.coverImage.extraLarge}
                  />

                  <MediaCard.LinkTitle
                    title={entrie.media.title.userPreferred}
                    id={entrie.media.id}
                  />
                </MediaCard.Container>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
