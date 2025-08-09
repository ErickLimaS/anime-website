"user client";
import React, { useState } from "react";
import styles from "./component.module.css";
import Link from "next/link";
import Image from "next/image";
import MediaFormatIcon from "../../../../DynamicAssets/MediaFormatIcon";
import DeleteSvg from "@/public/assets/trash.svg";
import {
  arrayRemove,
  doc,
  getFirestore,
  FieldPath,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "@/app/firebaseApp";
import { AnimatePresence, motion } from "framer-motion";
import fallbackImg from "@/public/photo-placeholder.jpg";
import { KeepWatchingMediaData } from "@/app/ts/interfaces/firestoreData";
import { useAppSelector } from "@/app/lib/redux/hooks";

type ComponentTypes = {
  animeInfo: KeepWatchingMediaData;
  deleteFromListHook: () => void;
  darkMode?: boolean;
};

function KeepWatchingEpisodeInfo({
  animeInfo,
  darkMode,
  deleteFromListHook,
}: ComponentTypes) {
  const [wasDeleted, setWasDeleted] = useState<boolean>(false);

  const auth = getAuth();

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  async function removeFromKeepWatching() {
    await setDoc(
      doc(db, "users", user?.uid || `${anilistUser?.id}`),
      {
        keepWatching: {
          [animeInfo.id]: arrayRemove(...[animeInfo]),
        },
      } as unknown as FieldPath,
      { merge: true }
    ).then(() => {
      setWasDeleted(true);

      setTimeout(() => {
        deleteFromListHook();
      }, 350);
    });
  }

  return (
    <AnimatePresence>
      {!wasDeleted && (
        <motion.div
          className={`${styles.media_item_container} ${darkMode ? styles.darkMode : ""}`}
          data-deleted={wasDeleted}
          animate={{ transition: { duration: 0.2 } }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div id={styles.img_container}>
            <Image
              title={animeInfo.title.romaji}
              src={animeInfo.episodeImg || fallbackImg}
              placeholder="blur"
              blurDataURL="https://upload.wikimedia.org/wikipedia/commons/8/8d/ERR0R_NO_IMAGE_FOUND.jpg"
              alt={
                (animeInfo.title && animeInfo.title.romaji) || "Not Available"
              }
              fill
              sizes="(max-width: 324px) 100vw, (max-width: 495px) 50vw, (max-width: 1025px) 200px, (max-width: 1479px) 180px, 174px"
            ></Image>

            <span className={styles.media_type_icon}>
              <MediaFormatIcon format={animeInfo.format} />

              <span className={styles.media_format_title}>
                {animeInfo.format == "TV" ? "ANIME" : animeInfo.format}
              </span>
            </span>

            <div className={styles.overlay_info_container}>
              <Link
                href={`/watch/${animeInfo.id}?source=${animeInfo.source}&episode=${animeInfo.episode}&q=${animeInfo.episodeId}&t=${animeInfo.episodeTimeLastStop || 0}${animeInfo.dub ? "&dub=true" : ""}`}
              >
                {animeInfo.format != "MOVIE" ? "CONTINUE EPISODE" : "CONTINUE"}
              </Link>
            </div>

            {animeInfo.format != "MOVIE" && (
              <span className={styles.episode_name_span}>
                Episode {animeInfo.episode}
              </span>
            )}

            <motion.div className={styles.progress_bar}>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX:
                    ((animeInfo.episodeTimeLastStop /
                      animeInfo.episodeDuration) *
                      100) /
                      100 || 0.005,
                }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          </div>

          <div className={styles.info_bottom}>
            <Link href={`/media/${animeInfo.id}`}>
              {animeInfo.title && animeInfo.title.romaji}
            </Link>

            <button
              onClick={() => removeFromKeepWatching()}
              title={`Remove ${animeInfo.title.romaji} from Keep Watching`}
            >
              <DeleteSvg width={16} height={16} alt="Delete" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default KeepWatchingEpisodeInfo;
