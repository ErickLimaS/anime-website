"use client";
import React from "react";
import OutsideLinkSvg from "@/public/assets/box-arrow-up-right.svg";
import { motion } from "framer-motion";
import styles from "./component.module.css";

function AnchorTag({ reviewId }: { reviewId: number }) {
  return (
    <motion.a
      href={`https://anilist.co/review/${reviewId}`}
      target="_blank"
      whileTap={{ scale: 0.9 }}
      className={styles.anchor_tag}
    >
      Continue on AniList <OutsideLinkSvg />
    </motion.a>
  );
}

export default AnchorTag;
