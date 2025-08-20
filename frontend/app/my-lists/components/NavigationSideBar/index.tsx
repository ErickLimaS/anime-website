"use client";
import Link from "next/link";
import React, { useLayoutEffect, useState } from "react";
import styles from "./component.module.css";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import { useAppSelector } from "@/app/lib/redux/hooks";
import { ListItemOnMediasSaved } from "@/app/ts/interfaces/firestoreData";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { AnimatePresence, motion } from "framer-motion";
import SvgFilter from "@/public/assets/funnel.svg";
import SvgClose from "@/public/assets/x.svg";

const showUpMotion = {
  hidden: {
    opacity: 0,
    scale: 1.08,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

function NavigationSideBar({
  isOnMobile,
  mediaFetched,
  params,
}: {
  isOnMobile: boolean;
  mediaFetched?: {
    name: string;
    status: string;
    entries: {
      id: number;
      userId: number;
      mediaId: number;
      media: MediaData;
    }[];
  }[];
  params?: {
    format: string;
    type: "tv" | "movie" | "manga";
  };
}) {
  const [currParams, setCurrParams] = useState("");
  const [mediasQuantity, setMediasQuantity] = useState<{
    all: number;
    completed: number;
    planning: number;
    current: number;
    dropped: number;
    paused: number;
    repeating: number;
    keepWatching: number;
  }>();

  const [isFiltersMenuOpen, setIsFiltersMenuOpen] = useState(false);

  const anilistUser = useAppSelector((state) => state.UserInfo?.value);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useLayoutEffect(() => {
    if (!loading && (user || anilistUser)) getUserLists();

    setCurrParams(params?.type || "");
  }, [loading, user, anilistUser, params]);

  async function getUserLists() {
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
    const activityLists: { name: string; medias: ListItemOnMediasSaved[] }[] =
      [];

    Object.keys(userDoc!.mediaListSavedByStatus)?.map((list) =>
      activityLists.push({
        name: list,
        medias: userDoc!.mediaListSavedByStatus[list],
      })
    );

    const mediasQuantityFiltered = {
      all: 0,
      completed:
        activityLists?.find((list) => list.name == "completed")?.medias
          .length || 0,
      planning:
        activityLists?.find((list) => list.name == "planning")?.medias.length ||
        0,
      current:
        activityLists?.find((list) => list.name == "current")?.medias.length ||
        0,
      dropped:
        activityLists?.find((list) => list.name == "dropped")?.medias.length ||
        0,
      paused:
        activityLists?.find((list) => list.name == "paused")?.medias.length ||
        0,
      repeating:
        activityLists?.find((list) => list.name == "repeating")?.medias
          .length || 0,
      keepWatching: keepWatchingList.length,
    };

    mediasQuantityFiltered.all =
      mediasQuantityFiltered.completed +
      mediasQuantityFiltered.current +
      mediasQuantityFiltered.dropped +
      mediasQuantityFiltered.paused +
      mediasQuantityFiltered.planning +
      mediasQuantityFiltered.repeating;

    setMediasQuantity(mediasQuantityFiltered);
  }

  return (
    <React.Fragment>
      {isOnMobile && (
        <button
          id={styles.btn_filters}
          onClick={() => setIsFiltersMenuOpen(!isFiltersMenuOpen)}
          data-active={isFiltersMenuOpen}
        >
          {isFiltersMenuOpen ? (
            <>
              <SvgClose width={16} height={16} alt="Close" /> FILTERS
            </>
          ) : (
            <>
              <SvgFilter width={16} height={16} alt="Filter" /> FILTERS
            </>
          )}
        </button>
      )}

      <AnimatePresence initial={false} mode="wait">
        {((isOnMobile && isFiltersMenuOpen == true) ||
          (!isOnMobile && !isFiltersMenuOpen)) && (
          <motion.div
            id={styles.backdrop}
            onClick={() => setIsFiltersMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, position: "sticky" }}
            exit={{ opacity: 0, position: "sticky" }}
          >
            {/* SHOW IF IT IS MOBILE AND MENU IS OPEN, OR IF IS NOT MOBILE (ON DESKTOP) AND MENU IS CLOSED */}
            {((isOnMobile && isFiltersMenuOpen == true) ||
              (!isOnMobile && !isFiltersMenuOpen)) && (
              <motion.div
                onClick={(e: { stopPropagation: () => void }) =>
                  e.stopPropagation()
                }
                onScrollCapture={(e: { stopPropagation: () => void }) =>
                  e.stopPropagation()
                }
                id={styles.container}
                variants={showUpMotion}
                initial="hidden"
                animate="visible"
                data-active={isFiltersMenuOpen}
              >
                <div id={styles.side_nav_container}>
                  <div>
                    <h5>FORMAT</h5>

                    <nav id={styles.nav_container}>
                      <ul>
                        <li
                          data-active={
                            !currParams.toLowerCase() ||
                            currParams.toLowerCase() == "tv"
                          }
                          onClick={() => setIsFiltersMenuOpen(false)}
                        >
                          <Link href={{ query: { type: "tv" } }}>Animes</Link>
                        </li>
                        <li
                          data-active={currParams == "manga"}
                          onClick={() => setIsFiltersMenuOpen(false)}
                        >
                          <Link href={{ query: { type: "manga" } }}>
                            Mangas
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>

                  <div>
                    <h5>LISTS</h5>

                    <nav id={styles.nav_container}>
                      <ul>
                        {params?.type != "manga" && (
                          <li onClick={() => setIsFiltersMenuOpen(false)}>
                            <Link href={`#keep-watching`}>
                              Keep Watching{" "}
                              <span>{mediasQuantity?.keepWatching || "0"}</span>
                            </Link>
                          </li>
                        )}
                        <li onClick={() => setIsFiltersMenuOpen(false)}>
                          <Link href={`#completed`}>
                            Completed{" "}
                            <span>
                              {mediasQuantity?.completed ||
                                mediaFetched?.find(
                                  (list) =>
                                    list.status?.toUpperCase() == "COMPLETED"
                                )?.entries.length ||
                                "0"}
                            </span>
                          </Link>
                        </li>
                        <li onClick={() => setIsFiltersMenuOpen(false)}>
                          <Link href={`#current`}>
                            {params?.type == "manga" ? "Reading" : "Watching"}{" "}
                            <span>
                              {mediasQuantity?.current ||
                                mediaFetched?.find(
                                  (list) =>
                                    list.status?.toUpperCase() == "CURRENT"
                                )?.entries.length ||
                                "0"}
                            </span>
                          </Link>
                        </li>
                        <li onClick={() => setIsFiltersMenuOpen(false)}>
                          <Link href={`#planning`}>
                            Planning{" "}
                            <span>
                              {mediasQuantity?.planning ||
                                mediaFetched?.find(
                                  (list) =>
                                    list.status?.toUpperCase() == "PLANNING"
                                )?.entries.length ||
                                "0"}
                            </span>
                          </Link>
                        </li>
                        <li onClick={() => setIsFiltersMenuOpen(false)}>
                          <Link href={`#dropped`}>
                            Dropped{" "}
                            <span>
                              {mediasQuantity?.dropped ||
                                mediaFetched?.find(
                                  (list) =>
                                    list.status?.toUpperCase() == "DROPPED"
                                )?.entries.length ||
                                "0"}
                            </span>
                          </Link>
                        </li>
                        <li onClick={() => setIsFiltersMenuOpen(false)}>
                          <Link href={`#paused`}>
                            Paused{" "}
                            <span>
                              {mediasQuantity?.paused ||
                                mediaFetched?.find(
                                  (list) =>
                                    list.status?.toUpperCase() == "PAUSED"
                                )?.entries.length ||
                                "0"}
                            </span>
                          </Link>
                        </li>
                        <li onClick={() => setIsFiltersMenuOpen(false)}>
                          <Link href={`#repeating`}>
                            Repeating{" "}
                            <span>
                              {mediasQuantity?.repeating ||
                                mediaFetched?.find(
                                  (list) =>
                                    list.status?.toUpperCase() == "REPEATING"
                                )?.entries.length ||
                                "0"}
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

export default NavigationSideBar;
