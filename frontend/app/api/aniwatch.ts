import {
  EpisodeLinksAnimeWatch,
  EpisodesFetchedAnimeWatch,
  MediaInfoFetchedAnimeWatch,
} from "@/app/ts/interfaces/aniwatchData";
import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const BASE_URL = `${process.env.NEXT_PUBLIC_ANIWATCH_API_URL}/api/v2/hianime`;

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
  // SEARCH MEDIA
  searchMedia: cache(
    async ({ query, page }: { query: string; page?: number }) => {
      try {
        const { data } = await Axios({
          url: `${BASE_URL}/search?q=${query}${page ? `&page=${page}` : ""}`,
        });
        
        return data.data as MediaInfoFetchedAnimeWatch;
      } catch (error) {
        console.log((error as Error).message);

        return null;
      }
    }
  ),

  // GET EPISODES, NO LINKS INCLUDED
  getMediaEpisodes: cache(async ({ mediaId }: { mediaId: string }) => {
    try {
      const { data } = await Axios({
        url: `${BASE_URL}/anime/${mediaId}/episodes`,
      });

      return data.data as EpisodesFetchedAnimeWatch;
    } catch (error) {
      console.log((error as Error).message);

      return null;
    }
  }),

  getEpisodeLink: cache(
    async ({
      episodeId,
      server,
      category,
    }: {
      episodeId: string;
      server?: string;
      category?: "dub" | "sub";
    }) => {
      try {
        const { data } = await Axios({
          url: `${BASE_URL}/episode/sources?animeEpisodeId=${episodeId}${server ? `&server=${server}` : ""}${category ? `&category=${category}` : ""}`,
        });

        return data.data as EpisodeLinksAnimeWatch;
      } catch (error) {
        console.log((error as Error).message);

        return null;
      }
    }
  ),
};
