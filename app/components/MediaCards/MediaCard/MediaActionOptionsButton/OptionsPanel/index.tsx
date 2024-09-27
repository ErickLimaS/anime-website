import * as AddToFavourites from "@/app/components/Buttons/AddToFavourites";
import { userMediaStatusEntries } from "@/app/lib/dataConstants/anilist";
import anilistUsers from "@/app/api/anilist/anilistUsers";
import { initFirebase } from "@/app/firebaseApp";
import { useAppSelector } from "@/app/lib/redux/hooks";
import {
  removeMediaOnListByStatus,
  updateUserMediaListByStatus,
} from "@/app/lib/user/userDocUpdateOptions";
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import FavouriteSvgFill from "@/public/assets/heart-fill.svg";
import FavouriteSvg from "@/public/assets/heart.svg";
import CheckFillSvg from "@/public/assets/check-circle-fill.svg";
import XSvg from "@/public/assets/x.svg";
import CheckSvg from "@/public/assets/check-circle.svg";
import styles from "./component.module.css";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { KeepWatchingMediaData } from "@/app/ts/interfaces/firestoreData";
import { MediaOnJSONFile } from "@/app/ts/interfaces/jsonMediaData";

const framerMotionOpenPanelTransition = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 100,
  },
};

export default function OptionsPanel({
  isPanelOpen,
  setIsPanelOpen,
  isFavourite,
  mediaListEntryInfo,
  mediaTitle,
  mediaInfo,
  amountWatchedOrRead,
  toggleLoginModalVisibility,
}: {
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFavourite: boolean | undefined;
  mediaListEntryInfo: MediaData["mediaListEntry"] | null;
  mediaTitle: MediaData["title"];
  mediaInfo: MediaData | MediaOnJSONFile | KeepWatchingMediaData;
  toggleLoginModalVisibility: () => void;
  amountWatchedOrRead?: number;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [mediaStatus, setMediaStatus] = useState<
    MediaData["mediaListEntry"]["status"] | null
  >(mediaListEntryInfo?.status || null);

  const anilistUser = useAppSelector((state) => state.UserInfo.value);

  const auth = getAuth();

  const [user] = useAuthState(auth);

  const db = getFirestore(initFirebase());

  useEffect(() => {
    if (!mediaInfo.mediaListEntry?.status && user) {
      isMediaOnUserDoc();
    }
  }, [mediaListEntryInfo?.status]);

  // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
  async function isMediaOnUserDoc() {
    if (!user) return;

    const userMediaLists = await getDoc(doc(db, "users", user.uid)).then(
      (res) => res.data()?.mediaListSavedByStatus
    );

    if (!userMediaLists) return;

    userMediaStatusEntries.map((btn) => {
      const wasMediaFound = userMediaLists[btn.value.toLowerCase()]?.find(
        (media: { id: number }) => media.id == mediaInfo.id
      );

      if (wasMediaFound) setMediaStatus(btn.value);
    });
  }

  async function handleAddMediaOnList({
    status,
  }: {
    status: MediaData["mediaListEntry"]["status"];
  }) {
    // Opens Login Modal
    if (!user && !anilistUser) return toggleLoginModalVisibility();

    setIsLoading(true);

    const mediaData = {
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

    // Remove from curr list
    if (mediaStatus) {
      const userMediaList = await getDoc(
        doc(db, "users", user?.uid || `${anilistUser?.id}`)
      ).then(
        (res) => res.data()?.mediaListSavedByStatus[mediaStatus.toLowerCase()]
      );

      const filterNewList = userMediaList.filter(
        (media: { id: number }) => media.id != mediaInfo.id
      );

      await removeMediaOnListByStatus({
        newListFiltered: filterNewList,
        status: mediaStatus,
        userId: user?.uid || `${anilistUser?.id}`,
      });

      // Remove from anilist list
      if (
        mediaListEntryInfo &&
        anilistUser &&
        mediaStatus?.toLowerCase() == status.toLowerCase()
      ) {
        await anilistUsers.removeMediaFromSelectedList({
          listItemEntryId: mediaListEntryInfo.id,
        });

        setIsLoading(false);

        setMediaStatus(null);

        return;
      }
    }

    await updateUserMediaListByStatus({
      status: status,
      userId: user?.uid || `${anilistUser?.id}`,
      mediaData: mediaData,
    });

    if (anilistUser) {
      await anilistUsers.addMediaToSelectedList({
        status: status,
        mediaId: mediaInfo.id,
        episodeOrChapterNumber:
          status == "COMPLETED" ? mediaInfo.episodes : amountWatchedOrRead || 0,
        numberWatchedOrReadUntilNow: amountWatchedOrRead || 0,
      });
    }

    setIsLoading(false);

    setMediaStatus(status);
  }

  return (
    <motion.div
      data-disabled-scroll={
        window.matchMedia("(max-width: 768px)").matches ? true : false
      }
      className={styles.options_panel_overlay}
      onClick={() => setIsPanelOpen(!isPanelOpen)}
      variants={framerMotionOpenPanelTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={styles.options_panel}
      >
        <div className={styles.panel_heading}>
          <h5>{mediaTitle.userPreferred}</h5>

          <motion.button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Close Menu"
          >
            <XSvg />
          </motion.button>
        </div>

        <ul>
          <li>
            <AddToFavourites.Button
              isActiveOnAnilist={isFavourite}
              mediaInfo={mediaInfo}
              customText={isFavourite ? "On Favourites" : "Add to Favourites"}
            >
              <AddToFavourites.SvgIcon>
                <FavouriteSvg fill="var(--brand-color)" />
              </AddToFavourites.SvgIcon>

              <AddToFavourites.SvgIcon>
                <FavouriteSvgFill fill="var(--brand-color)" />
              </AddToFavourites.SvgIcon>
            </AddToFavourites.Button>
          </li>
          {userMediaStatusEntries.map((btn) => (
            <li key={btn.value}>
              <motion.button
                data-active={mediaStatus == btn.value}
                disabled={isLoading}
                onClick={() => handleAddMediaOnList({ status: btn.value })}
                whileTap={{ scale: 0.9 }}
              >
                {mediaStatus == btn.value ? (
                  <>
                    <CheckFillSvg /> Setted as {btn.name}
                  </>
                ) : (
                  <>
                    <CheckSvg /> Set as {btn.name}
                  </>
                )}
              </motion.button>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
