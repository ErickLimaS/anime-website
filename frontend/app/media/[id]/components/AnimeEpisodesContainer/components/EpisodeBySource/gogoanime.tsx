import Link from "next/link";
import React from "react";
import Image from "next/image";
import styles from "./component.module.css";
import placeholderImg from "@/public/photo-placeholder.jpg";
import { GogoanimeMediaEpisodes } from "@/app/ts/interfaces/gogoanimeData";
import MarkEpisodeAsWatchedButton from "@/app/components/Buttons/MarkEpisodeAsWatched";
import { motion, Variants } from "framer-motion";

type ComponentTypes = {
  episodeInfo: GogoanimeMediaEpisodes;
  mediaId: number;
  episodeTitle: string;
  episodeNumber: number;
  backgroundImg?: string;
  episodeDescription?: string;
  motionStyle?: Variants;
  episodesWatchedInfo?: {
    mediaId: number;
    episodeNumber: number;
    episodeTitle: string;
  }[];
  useDubbedRoute: boolean;
  wasEpisodeWatchedOnAnilist?: boolean;
};

export default function ConsumetEpisode({
  episodeInfo,
  mediaId,
  episodeTitle,
  backgroundImg,
  episodeDescription,
  motionStyle,
  episodesWatchedInfo,
  episodeNumber,
  useDubbedRoute,
  wasEpisodeWatchedOnAnilist,
}: ComponentTypes) {
  function wasEpisodeWatched() {
    if (wasEpisodeWatchedOnAnilist) return true;

    const isEpisodeOnUserDoc = episodesWatchedInfo?.find(
      (episode) => episode.episodeNumber == episodeNumber
    )
      ? true
      : false;

    if (isEpisodeOnUserDoc) return true;

    return false;
  }

  return (
    <motion.li
      className={styles.container}
      variants={motionStyle}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      <Link
        href={`/watch/${mediaId}?source=gogoanime&episode=${episodeInfo.number}&q=${episodeInfo.id}${useDubbedRoute ? "&dub=true" : ""}`}
        className={styles.img_container}
      >
        <Image
          src={backgroundImg || placeholderImg}
          data-other-source={true}
          fill
          sizes="(max-width: 324px) 100vw, (max-width: 495px) 50vw, (max-width: 1025px) 200px, (max-width: 1479px) 180px, 174px"
          alt={`Watch episode ${episodeInfo.number}`}
          placeholder="blur"
          blurDataURL={
            "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgdmlld0JveD0nMCAwIDggNSc+CiAgICAgIDxmaWx0ZXIgaWQ9J2InIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0nc1JHQic+CiAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0nMScgLz4KICAgICAgPC9maWx0ZXI+CgogICAgICA8aW1hZ2UgcHJlc2VydmVBc3BlY3RSYXRpbz0nbm9uZScgZmlsdGVyPSd1cmwoI2IpJyB4PScwJyB5PScwJyBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyAKICAgICAgaHJlZj0nZGF0YTppbWFnZS9hdmlmO2Jhc2U2NCwvOWovMndCREFBZ0dCZ2NHQlFnSEJ3Y0pDUWdLREJRTkRBc0xEQmtTRXc4VUhSb2ZIaDBhSEJ3Z0pDNG5JQ0lzSXh3Y0tEY3BMREF4TkRRMEh5YzVQVGd5UEM0ek5ETC8yd0JEQVFrSkNRd0xEQmdORFJneUlSd2hNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpJeU1qSXlNakl5TWpML3dBQVJDQUFMQUJBREFTSUFBaEVCQXhFQi84UUFGZ0FCQVFFQUFBQUFBQUFBQUFBQUFBQUFCZ01ILzhRQUloQUFBZ0lDQWdFRkFRQUFBQUFBQUFBQUFRSURCQVVSQUNFU0JoTVVNVUhCLzhRQUZRRUJBUUFBQUFBQUFBQUFBQUFBQUFBQUFBTC94QUFaRVFBREFBTUFBQUFBQUFBQUFBQUFBQUFBQVJFQ0lUSC8yZ0FNQXdFQUFoRURFUUEvQU5KdFhNbEZqekxjaGZIMVl4dDVQa3B2ZjUzL0FEWGZJeGVzemtFclJZK3V0eVYxVVNsU3dDc1U4aHM2ME5nRTY0aEVVZCtrOWEzR2swRWkrTG82Z2dnOWNNNTJOYU9GdFdxbzltWlN6cXlIV2pvOWdmWDd3M3VsNHpoLy85az0nIC8+CiAgICA8L3N2Zz4KICA="
          }
        ></Image>
      </Link>

      <div className={styles.title_button_container}>
        <h3
          title={
            episodeTitle
              ? `Episode ${episodeInfo.number} - ${episodeTitle}`
              : `Episode ${episodeInfo.number}`
          }
        >
          <Link
            href={`/watch/${mediaId}?source=gogoanime&episode=${episodeInfo.number}&q=${episodeInfo.id}${useDubbedRoute ? "&dub=true" : ""}`}
          >
            {episodeTitle
              ? `${episodeInfo.number} - ${episodeTitle}`
              : `Episode ${episodeInfo.number}`}
          </Link>
        </h3>

        <MarkEpisodeAsWatchedButton
          episodeNumber={episodeNumber}
          episodeTitle={`${episodeInfo.number}`}
          mediaId={mediaId}
          wasWatched={wasEpisodeWatched()}
        />
      </div>

      <EpisodeDescription description={episodeDescription} />
    </motion.li>
  );
}

function EpisodeDescription({
  description,
}: {
  description: string | undefined;
}) {
  return (
    description && (
      <span className={styles.episode_description_container}>
        <p>{description}</p>
      </span>
    )
  );
}
