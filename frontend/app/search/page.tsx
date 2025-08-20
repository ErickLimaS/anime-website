import React from "react";
import styles from "./page.module.css";
import NavigationSideBar from "./components/NavigationSideBar";
import ResultsContainer from "./components/ResultsContainer";
import { headers } from "next/headers";
import { checkDeviceIsMobile } from "../lib/checkMobileOrDesktop";
import { Metadata } from "next";
import { animeDatabaseSearchMedias } from "../api/search/anime-database/search";

export const metadata: Metadata = {
  title: "Search | AniProject",
  description:
    "Filter animes released on that year, or just discover a new one in a genre you didnt watched yet.",
};

type SearchPageTypes = {
  type?: string;
  title?: string;
  genre?: string[];
  year?: number;
  status?: string;
  page?: string;
  sort?: string;
  season?: string;
};

async function SearchPage({ searchParams }: { searchParams: SearchPageTypes }) {
  const isMobile = checkDeviceIsMobile(headers());

  const sortedMedias = await animeDatabaseSearchMedias({ searchParams });

  return (
    <main id={styles.container}>
      <div id={styles.side_nav}>
        <NavigationSideBar isMobile={isMobile || false} />
      </div>

      <ResultsContainer
        mediasList={sortedMedias.results}
        lastUpdate={sortedMedias.lastUpdate}
        totalLength={sortedMedias.allResultsLength}
      />
    </main>
  );
}

export default SearchPage;
