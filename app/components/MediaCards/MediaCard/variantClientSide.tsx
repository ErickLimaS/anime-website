import React from "react";
import styles from "./component.module.css";
import Link from "next/link";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";

type ComponentTypes = {
  children: React.ReactNode;
  positionIndex?: number;
  onDarkMode?: boolean;
  isLoading?: boolean;
  isHiddenOnDesktop?: boolean;
  framerMotionProps?: {
    layoutId: string;
    mediaId: number;
    framerMotionExpandCardFunction: (parameter: string) => void;
  };
};

const framerMotionPopUpMediaMotion = {
  initial: {
    scale: 0,
  },
  animate: {
    scale: 1,
  },
};

export function FramerMotionContainer({
  children,
  positionIndex,
  onDarkMode,
  isLoading,
  isHiddenOnDesktop,
  framerMotionProps,
}: ComponentTypes) {
  const customStyle = positionIndex && { gridArea: `item${positionIndex}` };

  return (
    <motion.div
      variants={framerMotionProps ? framerMotionPopUpMediaMotion : undefined} // framer motion
      layoutId={framerMotionProps?.layoutId} // framer motion
      onClick={
        framerMotionProps
          ? () =>
            framerMotionProps.framerMotionExpandCardFunction(
              String(framerMotionProps.mediaId)
            )
          : undefined
      } // framer motion
      className={`${styles.media_item_container} ${onDarkMode ? styles.darkMode : ""} ${isHiddenOnDesktop ? styles.midia_item_container_hidden : ""}`}
      style={customStyle || undefined}
      data-loading={isLoading || false}
    >
      {children}
    </motion.div>
  );
}

export function ListItemContainer({
  children,
  positionIndex,
  showCoverArt,
  alternativeBorder,
  variants,
}: {
  children: React.ReactNode;
  positionIndex: number;
  showCoverArt?: {
    mediaInfo: MediaData;
  };
  alternativeBorder?: boolean;
  variants?: Variants;
}) {
  return (
    <motion.li
      className={styles.item_list}
      data-no-border={alternativeBorder}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      {showCoverArt && (
        <div className={styles.img_container}>
          <Link href={`/media/${showCoverArt.mediaInfo.id}`}>
            <Image
              src={showCoverArt.mediaInfo.coverImage.large}
              alt={`Cover Art For ${showCoverArt.mediaInfo.title.userPreferred}`}
              fill
              sizes="100%"
            />
          </Link>
        </div>
      )}

      {!showCoverArt && (
        <span className={styles.item_index}>{positionIndex}</span>
      )}

      {children}

      {alternativeBorder && <span className={styles.border_bottom}></span>}
    </motion.li>
  );
}
