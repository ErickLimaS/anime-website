import MediaFormatIcon from "@/app/components/DynamicAssets/MediaFormatIcon";
import stringToOnlyAlphabetic from "@/app/lib/convertStrings";
import React from "react";
import styles from "../component.module.css";
import { MediaData } from "@/app/ts/interfaces/anilistMediaData";

export default function MediaTypeIconSpan({
  formatOrType,
}: {
  formatOrType: MediaData["format"];
}) {
  function checkFormatAvailable() {
    if (!formatOrType) return "Not Available";

    return formatOrType == "TV"
      ? "ANIME"
      : stringToOnlyAlphabetic(formatOrType);
  }

  return (
    <span className={styles.media_type_icon}>
      <MediaFormatIcon format={formatOrType} />

      <span className={styles.media_format_title}>
        {checkFormatAvailable()}
      </span>
    </span>
  );
}
