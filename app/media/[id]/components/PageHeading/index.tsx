import React from "react";
import GridHeadingMediaInfo from "./GridInfo";
import HeadingInfo from "./HeadingInfo";
import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import { ImdbEpisode, ImdbMediaInfo } from "@/app/ts/interfaces/imdb";

export default function PageHeading({
  mediaInfo,
  imdbMediaInfo,
  searchParams,
  imdbEpisodes,
}: {
  mediaInfo: MediaDataFullInfo;
  imdbMediaInfo: ImdbMediaInfo;
  searchParams: { lang?: string };
  imdbEpisodes?: ImdbEpisode[];
}) {
  return (
    <React.Fragment>
      <HeadingInfo
        mediaInfo={mediaInfo}
        imdbMediaInfo={imdbMediaInfo}
        searchParams={searchParams}
        imdbEpisodes={imdbEpisodes}
      />

      <GridHeadingMediaInfo mediaInfo={mediaInfo} imdbEpisodes={imdbEpisodes} />
    </React.Fragment>
  );
}
