import React from "react";
import styles from "./page.module.css";
import MediasContainer from "./components/MediasContainer";
import NavigationSideBar from "./components/NavigationSideBar";
import { cookies, headers } from "next/headers";
import anilistUsers from "../api/anilist/anilistUsers";
import { MediaData } from "../ts/interfaces/anilistMediaData";
import { checkDeviceIsMobile } from "../lib/checkMobileOrDesktop";

export async function generateMetadata() {
  return {
    title: `My Lists | AniProject`,
    description: `User's Medias Lists of Medias Watched, Planned to Watch and much more.`,
  };
}

type FetchListsResultsType = {
  user: {
    id: number;
    name: string;
  };
  lists: {
    name: string;
    status: string;
    entries: {
      id: number;
      userId: number;
      mediaId: number;
      media: MediaData;
    }[];
  }[];
};

async function MyListsPage({
  searchParams,
}: {
  searchParams?: {
    format: string;
    sort: "title_desc" | "title_asc";
    type: "manga" | "tv" | "movie";
  };
}) {
  const accessTokenCookie = cookies().get("access_token")?.value;

  const userAuthorization = accessTokenCookie
    ? JSON.parse(accessTokenCookie).accessToken
    : undefined;

  const isOnMobile = checkDeviceIsMobile(headers());

  let dataBySearchQuery: FetchListsResultsType | null = null;

  if (userAuthorization) {
    const userId = await anilistUsers.getCurrUserData({
      accessToken: userAuthorization,
      getOnlyId: true,
    });

    dataBySearchQuery = await anilistUsers.getCurrUserLists({
      userId: userId,
      accessToken: userAuthorization,
      mediaType: (searchParams?.type == "tv"
        ? "ANIME"
        : searchParams?.type || "ANIME") as "ANIME" | "MANGA",
    });
  }

  return (
    <main id={styles.container}>
      <NavigationSideBar
        isOnMobile={isOnMobile}
        mediaFetched={dataBySearchQuery?.lists}
        params={searchParams}
      />

      <section id={styles.main_content_container}>
        <div id={styles.heading_container}>
          <h1>
            My Lists{" "}
            <span>
              {searchParams?.type
                ? `/ ${
                  searchParams.type == "tv"
                    ? "ANIME"
                    : searchParams.type.toUpperCase()
                }`
                : ""}
            </span>
          </h1>
        </div>

        <MediasContainer
          mediaFetched={dataBySearchQuery?.lists}
          params={searchParams}
        />
      </section>
    </main>
  );
}

export default MyListsPage;
