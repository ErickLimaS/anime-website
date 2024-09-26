"use client";
import React, { useState } from "react";
import styles from "../component.module.css";
import { AnimatePresence, motion } from "framer-motion";
import PlusSvg from "@/public/assets/plus-lg.svg";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";
import OptionsPanel from "./OptionsPanel";
import { useAppDispatch } from "@/app/lib/redux/hooks";
import { toggleShowLoginModalValue } from "@/app/lib/redux/features/loginModal";
import { KeepWatchingMediaData } from "@/app/ts/interfaces/firestoreData";
import { MediaOnJSONFile } from "@/app/ts/interfaces/jsonMediaData";

export default function MediaActionOptionsButton({
  mediaInfo,
}: {
  mediaInfo: MediaData | MediaOnJSONFile | KeepWatchingMediaData;
}) {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  return (
    <React.Fragment>
      <div className={styles.options_btn_container}>
        <motion.button
          aria-label={isPanelOpen ? "Close Options" : "Open Options"}
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          whileTap={{ scale: 0.9 }}
          data-active={isPanelOpen}
        >
          <PlusSvg fill="var(--brand-color)" />
        </motion.button>
      </div>

      <AnimatePresence>
        {isPanelOpen && (
          <OptionsPanel
            toggleLoginModalVisibility={() =>
              dispatch(toggleShowLoginModalValue())
            }
            isPanelOpen={isPanelOpen}
            setIsPanelOpen={setIsPanelOpen}
            isFavourite={mediaInfo?.isFavourite || false}
            mediaListEntryInfo={mediaInfo.mediaListEntry || null}
            mediaTitle={mediaInfo.title}
            mediaInfo={mediaInfo}
            amountWatchedOrRead={0}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}
