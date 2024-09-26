import {
  GogoanimeMediaData,
  GogoanimeMediaSearchResult,
} from "@/app/ts/interfaces/gogoanimeData";
import {
  MangadexMangaInfo,
  MangadexMangaSearchResult,
} from "@/app/ts/interfaces/mangadex";
import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL;

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
  retries: 3,
  retryDelay: (retryAttempt) => retryAttempt * 1300,
  retryCondition: (error) =>
    error.response?.status == 500 || error.response?.status == 503,
  onRetry: (retryNumber) =>
    console.log(
      `retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`
    ),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // SEARCH ANIME BY QUERY
  searchMedia: cache(
    async ({ query, page }: { query: string; page?: number }) => {
      try {
        const { data } = await Axios({
          url: `${CONSUMET_API_URL}/anime/gogoanime/${query}${page ? `?page=${page} ` : ""}`,
          method: "GET",
        });

        return data.results as
          | GogoanimeMediaSearchResult[]
          | MangadexMangaSearchResult[];
      } catch (error) {
        console.log(error);

        return null;
      }
    }
  ),

  // GET ANIME INFO
  getInfoFromThisMedia: cache(async ({ id }: { id: string | number }) => {
    try {
      const { data } = await Axios({
        url: `${CONSUMET_API_URL}/anime/gogoanime/info/${id}`,
        method: "GET",
      });

      return data as GogoanimeMediaData | MangadexMangaInfo;
    } catch (error) {
      console.log(error);

      return null;
    }
  }),

  // GET EPISODES LINKS FOR ANIMES AND MOVIES
  getEpisodeStreamingLinks: cache(
    async ({
      episodeId,
      serverName,
      useAlternateLinkOption,
    }: {
      episodeId: string | number;
      serverName?: string;
      useAlternateLinkOption?: boolean;
    }) => {
      try {
        const { data } = await Axios({
          url: `${CONSUMET_API_URL}${useAlternateLinkOption ? "/meta/anilist" : "/anime/gogoanime"}/watch/${episodeId}${serverName ? `?server=${serverName}` : ""}`,
          method: "GET",
        });

        return data;
      } catch (error) {
        console.log(error);

        return null;
      }
    }
  ),
};
