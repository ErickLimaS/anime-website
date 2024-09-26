import {
  MangadexMangaInfo,
  MangadexMangaPages,
  MangadexMangaSearchResult,
} from "@/app/ts/interfaces/mangadex";
import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL;

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
  retries: 3,
  retryDelay: (retryAttempt) => retryAttempt * 1500,
  retryCondition: (error) =>
    error.response?.status == 500 || error.response?.status == 503,
  onRetry: (retryNumber) =>
    console.log(
      `retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`
    ),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // SEARCH MANGA BY QUERY/TITLE
  searchMedia: cache(
    async ({ query, page }: { query: string; page?: number }) => {
      try {
        const { data } = await Axios({
          url: `${CONSUMET_API_URL}/manga/mangadex/${query}${page ? `?page=${page} ` : ""}`,
          method: "GET",
        });

        return data.results as MangadexMangaSearchResult[];
      } catch (error) {
        console.log(error);

        return null;
      }
    }
  ),

  // GET MANGA INFO
  getInfoFromThisMedia: cache(async ({ id }: { id: string | number }) => {
    try {
      const { data } = await Axios({
        url: `${CONSUMET_API_URL}/manga/mangadex/info/${id}`,
        method: "GET",
      });

      // sort ASC chapters
      const dataSorted = (data as MangadexMangaInfo).chapters.sort(
        (a, b) => Number(a.chapterNumber) - Number(b.chapterNumber)
      );

      data.chapters = dataSorted;

      return data as MangadexMangaInfo;
    } catch (error) {
      console.log(error);

      return null;
    }
  }),

  // GET PAGES FOR MANGA CHAPTER
  getChapterPages: cache(async ({ chapterId }: { chapterId: string }) => {
    try {
      const { data } = await Axios({
        url: `${CONSUMET_API_URL}/manga/mangadex/read/${chapterId}`,
        method: "GET",
      });

      return data as MangadexMangaPages[];
    } catch (error) {
      console.log(error);

      return null;
    }
  }),
};
