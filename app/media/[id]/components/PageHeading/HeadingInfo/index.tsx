import React from "react";
import styles from "./component.module.css";
import AddToNotificationsButton from "@/app/components/Buttons/AddToNotification";
import {
  MediaData,
  MediaDataFullInfo,
} from "@/app/ts/interfaces/anilistMediaData";
import Link from "next/link";
import HeadingTextAndMediaLogo from "./MediaTitleOrLogo";
import { ImdbEpisode, ImdbMediaInfo } from "@/app/ts/interfaces/imdb";
import * as AddToFavourites from "@/app/components/Buttons/AddToFavourites";
import * as AddToList from "@/app/components/Buttons/AddToList";
import FavouriteSvg from "@/public/assets/heart.svg";
import FavouriteFillSvg from "@/public/assets/heart-fill.svg";
import PlusSvg from "@/public/assets/plus-lg.svg";

export default function HeadingInfo({
  mediaInfo,
  searchParams,
  imdbMediaInfo,
  imdbEpisodes,
}: {
  mediaInfo: MediaDataFullInfo;
  searchParams: { lang?: string };
  imdbMediaInfo?: ImdbMediaInfo;
  imdbEpisodes?: ImdbEpisode[];
}) {
  return (
    <section id={styles.media_title_container}>
      <HeadingTextAndMediaLogo
        imdbMediaLogos={imdbMediaInfo?.logos}
        mediaTitles={mediaInfo.title}
        preferredLanguage={searchParams.lang}
      />

      <div
        id={styles.genres_and_type_container}
        className="display_flex_row align_items_center"
      >
        <div
          id={styles.genres_container}
          className="display_flex_row align_items_center"
        >
          {mediaInfo.genres && (
            <ul>
              {mediaInfo.genres.slice(0, 3).map((genre, key) => (
                <li key={key}>
                  <Link href={`/search?genre=[${genre.toLowerCase()}]`}>
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {mediaInfo.format && (
            <span
              style={{
                color: mediaInfo.coverImage?.color || "var(--white-100)",
              }}
            >
              {(mediaInfo.format == "TV"
                ? "anime"
                : mediaInfo.format
              ).toUpperCase()}
            </span>
          )}
        </div>

        <div id={styles.btns_actions_container}>
          <AddToNotificationsButton mediaInfo={mediaInfo} />

          <AddToList.Button
            statusOnAnilist={mediaInfo.mediaListEntry?.status}
            listEntryId={mediaInfo.mediaListEntry?.id}
            mediaInfo={mediaInfo as MediaData}
            imdbEpisodesList={imdbEpisodes}
            amountWatchedOrRead={mediaInfo.mediaListEntry?.progress}
          >
            <AddToFavourites.SvgIcon>
              <PlusSvg fill="var(--white-100)" />
            </AddToFavourites.SvgIcon>

            <AddToFavourites.SvgIcon>
              <PlusSvg fill="var(--brand-color)" />
            </AddToFavourites.SvgIcon>
          </AddToList.Button>

          <AddToFavourites.Button
            isActiveOnAnilist={mediaInfo.isFavourite}
            mediaInfo={mediaInfo as MediaData}
          >
            <AddToFavourites.SvgIcon>
              <FavouriteSvg fill="var(--white-100)" />
            </AddToFavourites.SvgIcon>

            <AddToFavourites.SvgIcon>
              <FavouriteFillSvg fill="var(--brand-color)" />
            </AddToFavourites.SvgIcon>
          </AddToFavourites.Button>
        </div>
      </div>
    </section>
  );
}
