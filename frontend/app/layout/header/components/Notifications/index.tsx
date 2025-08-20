"use client";
import React, { useEffect, useState } from "react";
import BellFillSvg from "@/public/assets/bell-fill.svg";
import BellSvg from "@/public/assets/bell.svg";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  FieldPath,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { initFirebase } from "@/app/firebaseApp";
import styles from "./component.module.css";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { convertFromUnix, getCurrentUnixDate } from "@/app/lib/formatDateUnix";
import anilist from "@/app/api/anilist/anilistMedias";
import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import { useAppSelector } from "@/app/lib/redux/hooks";
import { NotificationsCollectionFirebase } from "@/app/ts/interfaces/firestoreData";

function NotificationsContainer() {
  //
  // HOW IT WORKS
  //
  // This component is related to a Collection called "Notifications" on Firebase. This collection stores
  // the episodes for each media and has the number and release date on it.
  // The logic here is that, the user is assigned to these Medias on Notifications Collection, and in this
  // component, it checks the latest date the User Doc with these info awas updated. If the date is older than
  // the latests episodes released, it shows on Header Notification Modal.
  //
  // Was make this way because any time a user is assigned to this same media, that user updates the medias info available
  // for all the user. Previously, it was meant that each user had its own notification field on his doc.

  const [notificationsList, setNotificationsList] = useState<
    NotificationsCollectionFirebase[]
  >([]);
  const [hasNewNotifications, setHasNewNotifications] =
    useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const anilistUser = useAppSelector((state) => state.UserInfo?.value);

  const auth = getAuth();
  const [user] = useAuthState(auth);
  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (
      localStorage.getItem("notificationsVisualized") &&
      localStorage.getItem("notificationsVisualized") == "true"
    ) {
      setHasNewNotifications(false);
    } else {
      localStorage.setItem("notificationsVisualized", "true");
    }

    doesNotificationsIsOnLocalStorage();
  }, [user]);

  function isCurrDateBiggerThanLastUpdate() {
    const dateNow = getCurrentUnixDate();
    const dateLastUpdate =
      Number(Number(localStorage.getItem("notificationsLastUpdate")) + 600) ||
      0;

    return dateNow >= dateLastUpdate;
  }

  async function doesNotificationsIsOnLocalStorage() {
    if (!user && !anilistUser) return;

    if (localStorage.getItem("notifications") == undefined) {
      return verifyNotificationsAssignedThenStore();
    }

    updateNotificationsOnLocalStorage();
  }

  function setNewNotificationsToPanel(
    notificationsList: NotificationsCollectionFirebase[]
  ) {
    if (notificationsList.length == 0) return;

    localStorage.setItem("notificationsVisualized", "false");

    setHasNewNotifications(true);

    setNotificationsList(notificationsList);
  }

  async function mapUserAssignedNotificationsToFullMediaDoc() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userAssignedNotifications: any[] = [];

    await getDoc(doc(db, "users", user?.uid || `${anilistUser?.id}`)).then(
      (res) => {
        userAssignedNotifications = res.data()?.notifications || [];
      }
    );

    if (userAssignedNotifications.length > 0) {
      const mediasIDsArray = [];

      mediasIDsArray.push(
        userAssignedNotifications.map((item) => `${item.mediaId}`)
      );

      const notificationsDocs = (await getDocs(
        query(
          collection(db, "notifications"),
          where("mediaId", "in", mediasIDsArray[0])
        )
      ).then((res) =>
        res.docs.map((item) => item.data())
      )) as NotificationsCollectionFirebase[];

      if (notificationsDocs) {
        // sort episodes number
        notificationsDocs.map(
          (media) =>
            (media.episodes = media.episodes.sort(
              (episode1, episode2) => episode1.number - episode2.number
            ))
        );

        notificationsDocs.map(
          (media) =>
            (media.episodes = [media.episodes[media.episodes.length - 1]])
        );
      }

      userAssignedNotifications = notificationsDocs;
    }

    return userAssignedNotifications;
  }

  async function verifyNotificationsAssignedThenStore() {
    const userAssignedNotifications =
      await mapUserAssignedNotificationsToFullMediaDoc();

    localStorage.setItem("notificationsVisualized", "true");
    localStorage.setItem(
      "notifications",
      JSON.stringify(userAssignedNotifications)
    );
    localStorage.setItem(
      "notificationsLastUpdate",
      `${(new Date().getTime() / 1000).toFixed(0)}`
    );

    setNewNotificationsToPanel(userAssignedNotifications);
  }

  async function updateNotificationsOnLocalStorage() {
    const userAssignedNotifications =
      await mapUserAssignedNotificationsToFullMediaDoc();

    if (isCurrDateBiggerThanLastUpdate()) {
      if (userAssignedNotifications) {
        const notificationsToBeShownList = [];

        for (let i = 0; userAssignedNotifications.length >= i + 1; i++) {
          const notificationsMatchingIDsList = userAssignedNotifications.find(
            (notification) =>
              `${notification.mediaId}` ==
              `${userAssignedNotifications[i].mediaId}`
          );

          if (notificationsMatchingIDsList) {
            if (!notificationsMatchingIDsList.title)
              notificationsMatchingIDsList.title =
                userAssignedNotifications[i].title;

            const lastEpisodeNotificationVisualizedOnDB =
              notificationsMatchingIDsList.episodes[
                notificationsMatchingIDsList.episodes.length - 1
              ];

            const lastEpisodeNotificationVisualizedOnLocal =
              userAssignedNotifications[i];

            // if latest Episode Released on DB is bigger than last episode notified
            if (
              lastEpisodeNotificationVisualizedOnDB.number >
              lastEpisodeNotificationVisualizedOnLocal.lastEpisodeNotified
            ) {
              if (
                Number((new Date().getTime() / 1000).toFixed(0)) >
                lastEpisodeNotificationVisualizedOnDB.releaseDate!
              ) {
                notificationsToBeShownList.push(notificationsMatchingIDsList);
              }
            }
          }
        }

        if (notificationsToBeShownList.length > 0) {
          setNewNotificationsToPanel(notificationsToBeShownList);
        }

        localStorage.setItem("notificationsVisualized", "true");
        localStorage.setItem(
          "notifications",
          JSON.stringify(userAssignedNotifications)
        );
        localStorage.setItem(
          "notificationsLastUpdate",
          `${(new Date().getTime() / 1000).toFixed(0)}`
        );
      }
    }

    // if (userAssignedNotifications.length == 0) {
    //     userAssignedNotifications = JSON.parse(localStorage.getItem('notifications')!) || []
    // }
  }

  function toggleOpenNotificationsPanel() {
    setIsPanelOpen(!isPanelOpen);

    localStorage.setItem("notificationsVisualized", "true");

    setHasNewNotifications(false);

    if (notificationsList.length == 0) return;

    const stillReleasingMediasNotifications: NotificationsCollectionFirebase[] =
      notificationsList.filter(
        (mediaNotification) => mediaNotification.isComplete == false
      );

    const finishedMediasNotifications: NotificationsCollectionFirebase[] =
      notificationsList.filter(
        (mediaNotification) => mediaNotification.isComplete == true
      );

    async function updateMediaOnNotificationsCollection(
      mediaData: MediaDataFullInfo
    ) {
      const mediaNotificationDoc = (await getDoc(
        doc(db, "notifications", `${mediaData.id}`)
      ).then((res) => res.data())) as
        | NotificationsCollectionFirebase
        | DocumentData;

      mediaNotificationDoc.nextReleaseDate =
        mediaData.nextAiringEpisode?.airingAt;
      mediaNotificationDoc.status = mediaData.status;
      mediaNotificationDoc.lastUpdate = Number(
        (new Date().getTime() / 1000).toFixed(0)
      );
      mediaNotificationDoc.isComplete =
        mediaData.status == "COMPLETE" ? true : false;

      if (mediaData.status != "FINISHED") {
        (mediaNotificationDoc as NotificationsCollectionFirebase).episodes.map(
          (item) =>
            (item.wasReleased =
              Number((new Date().getTime() / 1000).toFixed(0)) >
              (item.releaseDate ? item.releaseDate : 0))
        );

        mediaNotificationDoc.episodes.push({
          releaseDate: mediaData.nextAiringEpisode?.airingAt || null,
          number: mediaData.nextAiringEpisode?.episode,
          wasReleased:
            Number((new Date().getTime() / 1000).toFixed(0)) >
            mediaData.nextAiringEpisode?.airingAt,
        });
      }

      await updateDoc(
        doc(db, "notifications", `${mediaData.id}`),
        mediaNotificationDoc
      );
    }

    async function updateNotificationsOnLocal() {
      const notificationsOnUserDoc = await getDoc(
        doc(db, "users", user?.uid || `${anilistUser?.id}`)
      ).then((res) => res.data()?.notifications || []);

      localStorage.setItem(
        "notifications",
        JSON.stringify(notificationsOnUserDoc)
      );
      localStorage.setItem(
        "notificationsLastUpdate",
        `${(new Date().getTime() / 1000).toFixed(0)}`
      );
    }

    if (stillReleasingMediasNotifications.length > 0) {
      stillReleasingMediasNotifications.map(async (mediaNotification) => {
        // gets curr media's latest info
        const mediaInfo = (await anilist.getMediaInfo({
          id: Number(mediaNotification.mediaId),
        })) as MediaDataFullInfo;

        await updateMediaOnNotificationsCollection(mediaInfo);

        // removes older notication with previous data
        await updateDoc(
          doc(db, "users", user?.uid || `${anilistUser?.id}`),
          {
            notifications: arrayRemove(
              ...[
                {
                  // if theres no new episode to release, set total episodes number as last notified
                  lastEpisodeNotified: mediaInfo.nextAiringEpisode
                    ? mediaInfo.nextAiringEpisode.episode - 2
                    : mediaInfo.episodes,
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
        ).catch((err) => {
          return console.log(err);
        });

        // then adds new data to media notification
        await updateDoc(
          doc(db, "users", user?.uid || `${anilistUser?.id}`),
          {
            notifications: arrayUnion(
              ...[
                {
                  lastEpisodeNotified: mediaInfo.nextAiringEpisode
                    ? mediaInfo.nextAiringEpisode?.episode - 1
                    : mediaInfo.episodes,
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
        ).catch((err) => {
          return console.log(err);
        });
      });
    }

    if (finishedMediasNotifications.length > 0) {
      finishedMediasNotifications.map(async (mediaNotification) => {
        // removes older notication with previous data
        await updateDoc(
          doc(db, "users", user?.uid || `${anilistUser?.id}`),
          {
            notifications: arrayRemove(...[mediaNotification]),
          } as unknown as FieldPath,
          { merge: true }
        ).catch((err) => {
          return console.log(err);
        });

        // add new data to notification media
        await updateDoc(
          doc(db, "users", user?.uid || `${anilistUser?.id}`),
          {
            notifications: arrayUnion(...[mediaNotification]),
          } as unknown as FieldPath,
          { merge: true }
        ).catch((err) => {
          return console.log(err);
        });
      });
    }

    updateNotificationsOnLocal();
  }

  if (user || anilistUser) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          exit={{ opacity: 0, width: 0 }}
          id={styles.notification_container}
        >
          <button
            id={styles.notification_btn}
            onClick={() => toggleOpenNotificationsPanel()}
            title={isPanelOpen ? "Close Notifications" : "Open Notifications"}
            aria-controls={styles.results_container}
            data-active={isPanelOpen}
          >
            {hasNewNotifications ? (
              <BellFillSvg fill="white" width={16} height={16} />
            ) : (
              <BellSvg fill="white" width={16} height={16} />
            )}
          </button>

          {hasNewNotifications && (
            <span id={styles.notifications_badge}>
              {notificationsList.length}
            </span>
          )}

          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                initial={{ y: "-20px", opacity: 0 }}
                animate={{ y: "0px", opacity: 1 }}
                exit={{ y: "-20px", opacity: 0 }}
                id={styles.results_container}
                aria-expanded={isPanelOpen}
              >
                <h4>Latest Notifications</h4>

                {notificationsList.length == 0 && (
                  <div>
                    <p style={{ color: "var(--white-100)" }}>
                      No New Notifications
                    </p>
                  </div>
                )}

                {notificationsList.length != 0 && (
                  <ul>
                    {notificationsList.map((media, key) => (
                      <li
                        key={key}
                        className={styles.notification_item_container}
                        aria-label={`${media.title.romaji} new episode released`}
                      >
                        <div className={styles.img_container}>
                          <Image
                            src={media.coverImage.large}
                            alt={media.title.romaji}
                            fill
                            sizes="100px"
                          />
                        </div>

                        <div className={styles.notification_item_info}>
                          <h5>
                            Episode{" "}
                            {media.episodes[media.episodes.length - 1]?.number}{" "}
                            Released!
                          </h5>

                          <small>{media.title.romaji}</small>

                          {media.status != "RELEASING" && (
                            <p>
                              <b>Watch the Season Finale!</b>
                            </p>
                          )}

                          <p>
                            Released on {convertFromUnix(media.nextReleaseDate)}
                          </p>

                          <Link href={`/media/${media.mediaId}`}>SEE MORE</Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    );
  }
}

export default NotificationsContainer;
