import { convertToUnix, lastHourOfTheDay } from "@/app/lib/formatDateUnix";
import {
  AiringMediaResult,
  MediaData,
  TrendingMediaResult,
} from "@/app/ts/interfaces/anilistMediaData";
import Axios from "axios";
import {
  requestMedias,
  requestMediasByDateAndTimeRelease,
  mediaTrendingApiQueryRequest,
} from "./anilistQueryConstants";
import { cache } from "react";
import axiosRetry from "axios-retry";
import { getHeadersWithAuthorization } from "./anilistUsers";
import { BASE_ANILIST_URL, getCurrentSeason } from "./utils";
import axios from "axios";

const NEXT_PUBLIC_NEXT_BACKEND_URL = process.env.NEXT_PUBLIC_NEXT_BACKEND_URL;

// returns medias with adult content
function filterMediasWithAdultContent(
  mediasList: MediaData[] | AiringMediaResult[],
  reponseType?: "mediaByFormat"
) {
  if (reponseType == "mediaByFormat") {
    const mediasFiltered = (mediasList as MediaData[]).filter(
      (item) => item.isAdult == false
    );

    return mediasFiltered;
  } else {
    const mediasFiltered = (mediasList as AiringMediaResult[]).filter(
      (item) => item.media.isAdult == false
    );

    return mediasFiltered;
  }
}

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
  retries: 3,
  retryDelay: (retryAttempt) => retryAttempt * 250,
  retryCondition: (error) =>
    error.response?.status == 500 ||
    error.response?.status == 404 ||
    error.response?.status == 503,
  onRetry: (retryNumber) =>
    console.log(
      `retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`
    ),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // HOME PAGE
  getNewReleases: cache(
    async ({
      type,
      format,
      sort,
      showAdultContent,
      status,
      page,
      perPage,
      accessToken,
    }: {
      type: string;
      format?: string;
      sort?: string;
      showAdultContent?: boolean;
      status?:
        | "FINISHED"
        | "RELEASING"
        | "NOT_YET_RELEASED"
        | "CANCELLED"
        | "HIATUS";
      page?: number;
      perPage?: number;
      accessToken?: string;
    }) => {
      const season = getCurrentSeason();

      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      try {
        const graphqlQuery = {
          query: requestMedias(
            status ? ", $status: MediaStatus" : undefined,
            status ? ", status: $status" : undefined
          ),
          variables: {
            type: `${type}`,
            format: `${(format === "MOVIE" && "MOVIE") || (type === "MANGA" && "MANGA") || (type === "ANIME" && "TV")}`,
            page: page || 1,
            sort: sort || "POPULARITY_DESC",
            perPage: perPage || 20,
            season: status ? undefined : `${season}`,
            status: status ? status : undefined,
            seasonYear: `${new Date().getFullYear()}`,
            showAdultContent: showAdultContent || false,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return data.data.Page.media as MediaData[];
      } catch (error) {
        console.log((error as Error).message);

        return null;
      }
    }
  ),

  //SEARCH
  getSeachResults: async ({
    query,
    showAdultContent,
    accessToken,
  }: {
    query: string;
    showAdultContent?: boolean;
    accessToken?: string;
  }) => {
    try {
      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      const authToken = headersCustom?.Authorization?.slice(8);

      const { data } = await axios({
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/search/any/anilist`,
        params: {
          query: query,
          authToken: authToken,
          page: 1,
          sort: "TRENDING_DESC",
          perPage: 15,
          showAdultContent: showAdultContent == true ? undefined : false,
        },
      });

      return showAdultContent
        ? (data.results as MediaData[])
        : filterMediasWithAdultContent(data.results, "mediaByFormat");
    } catch (error) {
      console.log((error as Error).message);

      return null;
    }
  },

  // RELEASING THIS WEEK
  getReleasingThisWeek: async ({
    type,
    page,
    showAdultContent,
    accessToken,
  }: {
    type: string;
    format?: string;
    page?: number;
    showAdultContent?: boolean;
    accessToken?: string;
  }) => {
    try {
      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      const authToken = headersCustom?.Authorization?.slice(8);

      const thisYear = new Date().getFullYear();

      const { data } = await Axios({
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/medias/${type.toLowerCase()}/TV}`,
        params: {
          authToken: authToken,
          page: page || 1,
          perPage: 10,
          sort: "TRENDING_DESC",
          showAdultContent: showAdultContent || false,
          season: getCurrentSeason(),
          seasonYear: thisYear,
        },
      });

      return data.results as MediaData[];
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  },

  // RELEASING BY DAYS RANGE - use medias route on back
  getReleasingByDaysRange: cache(
    async ({
      type,
      days,
      pageNumber,
      perPage,
      showAdultContent,
      accessToken,
    }: {
      type: string;
      days: 1 | 7 | 30;
      pageNumber?: number;
      perPage?: number;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const dateInUnix = convertToUnix(days);

        const graphqlQuery = {
          query: requestMediasByDateAndTimeRelease(),
          variables: {
            page: pageNumber || 1,
            perPage: perPage || 5,
            type: type,
            sort: "TIME_DESC",
            showAdultContent: showAdultContent == true ? undefined : false,
            airingAt_greater: dateInUnix,
            airingAt_lesser: lastHourOfTheDay(1), // returns today last hour
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return showAdultContent
          ? (data.data.Page.airingSchedules as AiringMediaResult[])
          : (filterMediasWithAdultContent(
              data.data.Page.airingSchedules
            ) as AiringMediaResult[]);
      } catch (error) {
        console.log((error as Error).message);

        return null;
      }
    }
  ),

  // TRENDING - use medias route on back
  getTrendingMedia: cache(
    async ({
      sort,
      showAdultContent,
      accessToken,
    }: {
      sort?: string;
      showAdultContent?: boolean;
      accessToken?: string;
    }) => {
      try {
        const headersCustom = await getHeadersWithAuthorization({
          accessToken: accessToken,
        });

        const thisYear = new Date().getFullYear();

        const graphqlQuery = {
          query: mediaTrendingApiQueryRequest(),
          variables: {
            page: 1,
            sort: sort || "TRENDING_DESC",
            perPage: 20,
            showAdultContent: showAdultContent == true ? undefined : false,
            season: getCurrentSeason(),
            year: thisYear,
          },
        };

        const { data } = await Axios({
          url: `${BASE_ANILIST_URL}`,
          method: "POST",
          headers: headersCustom,
          data: graphqlQuery,
        });

        return data.data.Page.mediaTrends as TrendingMediaResult[];
      } catch (error) {
        console.log((error as Error).message);

        return null;
      }
    }
  ),

  // MEDIAS WITH INDICATED FORMAT
  getMediaForThisFormat: async ({
    type,
    sort,
    pageNumber,
    perPage,
    showAdultContent,
    accessToken,
  }: {
    type: string;
    sort?: string;
    pageNumber?: number;
    perPage?: number;
    showAdultContent?: boolean;
    accessToken?: string;
  }) => {
    try {
      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      const authToken = headersCustom?.Authorization?.slice(8);

      const { data } = await axios({
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/medias/${type.toLowerCase()}/TV`,
        params: {
          authToken: authToken,
          page: pageNumber || 1,
          sort: sort || "TRENDING_DESC",
          perPage: perPage || 20,
          showAdultContent: showAdultContent == true ? undefined : false,
        },
      });

      return showAdultContent
        ? (data.results as MediaData[])
        : (filterMediasWithAdultContent(
            data.results,
            "mediaByFormat"
          ) as MediaData[]);
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  },

  // GET MEDIA INFO BY ID
  getMediaInfo: async ({
    id,
    accessToken,
  }: {
    id: number;
    accessToken?: string;
  }) => {
    try {
      const headersCustom = await getHeadersWithAuthorization({
        accessToken: accessToken,
      });

      const authToken = headersCustom?.Authorization?.slice(8);

      const { data } = await axios({
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/media-info/anime/anilist`,
        params: {
          query: id,
          authToken: authToken,
        },
      });

      return data.result as MediaData;
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  },
};
