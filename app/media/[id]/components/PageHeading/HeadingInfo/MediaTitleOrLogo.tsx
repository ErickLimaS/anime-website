import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import { ImdbMediaInfo } from "@/app/ts/interfaces/imdb";
import Image from "next/image";
import React from "react";
import styles from "./component.module.css";

export default function HeadingTextAndMediaLogo({
  imdbMediaLogos,
  preferredLanguage,
  mediaTitles,
}: {
  imdbMediaLogos: ImdbMediaInfo["logos"] | undefined;
  mediaTitles: MediaDataFullInfo["title"];
  preferredLanguage?: string;
}) {
  const userPreferredTitleLanguage = preferredLanguage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (mediaTitles as any)[preferredLanguage.toLowerCase()]
    : null;

  return (
    <React.Fragment>
      {imdbMediaLogos && imdbMediaLogos?.length > 0 ? (
        <React.Fragment>
          <h1>
            {(userPreferredTitleLanguage || mediaTitles.romaji).toUpperCase()}
          </h1>

          <div
            className={styles.heading_img_container}
            style={{ aspectRatio: imdbMediaLogos[0]?.aspectRatio }}
          >
            <Image
              src={imdbMediaLogos[0]?.url}
              alt={userPreferredTitleLanguage || mediaTitles.romaji}
              fill
              sizes="(max-width: 520px) 100%, 280px"
            />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <small>
            {userPreferredTitleLanguage == imdbMediaLogos && mediaTitles.romaji
              ? mediaTitles.native
              : mediaTitles.romaji}
          </small>

          <h1 id={styles.heading_title}>
            {(userPreferredTitleLanguage || mediaTitles.romaji).toUpperCase()}
          </h1>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
