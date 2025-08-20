import React from "react";
import PlaySvg from "@/public/assets/play-circle.svg";
import BookSvg from "@/public/assets/book.svg";
import CalendarSvg from "@/public/assets/calendar3.svg";
import ClockSvg from "@/public/assets/clock.svg";
import ProgressSvg from "@/public/assets/progress.svg";
import styles from "./component.module.css";
import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import PlayBtn from "../../WatchPlayBtn";
import stringToOnlyAlphabetic from "@/app/lib/convertStrings";
import { ImdbEpisode } from "@/app/ts/interfaces/imdb";
import { getMediaReleaseDate } from "@/app/lib/formatDateUnix";

export default function GridHeadingMediaInfo({
  mediaInfo,
  imdbEpisodes,
}: {
  mediaInfo: MediaDataFullInfo;
  imdbEpisodes?: ImdbEpisode[];
}) {
  function convertMediaStatus(status: string) {
    if (status == "NOT_YET_RELEASED") {
      return "TO BE RELEASED";
    } else if (status == "FINISHED") {
      return "COMPLETE";
    }

    return stringToOnlyAlphabetic(status) || "Not Available";
  }

  function getEpisodesQuantity() {
    return imdbEpisodes?.length || mediaInfo.episodes || "Not Available";
  }

  return (
    <section id={styles.info_list_container}>
      <ul>
        {mediaInfo.type != "MANGA" && (
          <PlayBtn
            mediaId={mediaInfo.id}
            mediaTitle={mediaInfo.title.romaji}
            mediaFormat={mediaInfo.format}
            anilistLastEpisodeWatched={
              mediaInfo.mediaListEntry?.status != "COMPLETED"
                ? mediaInfo.mediaListEntry?.progress
                : undefined
            }
          />
        )}

        {mediaInfo.format == "MOVIE" ? (
          <li className={`${styles.info_item}`}>
            <h2>SOURCE</h2>

            <p>
              {stringToOnlyAlphabetic(mediaInfo.source.toUpperCase()) ||
                "Not Available"}
            </p>
          </li>
        ) : (
          <li className={`${styles.info_item}`}>
            <span>
              <ProgressSvg width={16} height={16} alt="Progress" />
            </span>

            <h2>STATUS</h2>

            <p>{convertMediaStatus(mediaInfo.status || "Not Available")}</p>
          </li>
        )}

        {mediaInfo.type == "ANIME" &&
          mediaInfo.format != "MOVIE" &&
          mediaInfo.status != "NOT_YET_RELEASED" && (
          <li className={`${styles.info_item}`}>
            <span>
              <PlaySvg width={16} height={16} alt="Episodes" />
            </span>

            <h2>EPISODES</h2>

            <p>{getEpisodesQuantity()}</p>
          </li>
        )}

        {mediaInfo.type == "MANGA" && (
          <li className={`${styles.info_item}`}>
            <span>
              <BookSvg width={16} height={16} alt="Volumes" />
            </span>

            <h2>VOLUMES</h2>

            <p>{mediaInfo.volumes || "Not Available"}</p>
          </li>
        )}

        <li className={`${styles.info_item}`}>
          <span>
            <CalendarSvg width={16} height={16} alt="Release" />
          </span>

          <h2>RELEASE</h2>

          <p className={styles.width_min_content}>
            {getMediaReleaseDate(
              mediaInfo.startDate ? mediaInfo.endDate : undefined
            )}
          </p>
        </li>

        <li className={`${styles.info_item}`}>
          {mediaInfo.type == "ANIME" && (
            <React.Fragment>
              <span>
                <ClockSvg width={16} height={16} alt="Length" />
              </span>

              <h2>LENGTH</h2>

              <p>
                {mediaInfo.duration == null
                  ? "Not Available"
                  : `${mediaInfo.duration} min` || "Not Available"}
              </p>
            </React.Fragment>
          )}

          {mediaInfo.type == "MANGA" && (
            <React.Fragment>
              <span>
                <BookSvg width={16} height={16} alt="Chapters" />
              </span>

              <h2>CHAPTERS</h2>

              <p>{mediaInfo.chapters || "Not Available"}</p>
            </React.Fragment>
          )}
        </li>
      </ul>
    </section>
  );
}
