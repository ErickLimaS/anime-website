import {
  AiringMediaResult,
  MediaData,
  TrendingMediaResult,
} from "@/app/ts/interfaces/anilistMediaData";
import { getHeadersWithAuthorization } from "./anilistUsers";
import { getCurrentSeason } from "./utils";
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // HOME PAGE
  getNewReleases: async ({
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

    try {
      const { data } = await axios({
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/medias/${type.toLowerCase()}/${format || "TV"}`,
        params: {
          authToken: accessToken,
          page: page || 1,
          sort: sort || "POPULARITY_DESC",
          perPage: perPage || 20,
          status: status ? status : undefined,
          season: status ? undefined : season,
          seasonYear: new Date().getFullYear(),
          showAdultContent: showAdultContent || false,
        },
      });

      return data.results as MediaData[];
    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  },

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
      console.error((error as Error).message);

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

      const { data } = await axios({
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

  // RELEASING BY DAYS RANGE
  getReleasingByDaysRange: async ({
    type,
    days,
    pageNumber,
    perPage,
    showAdultContent,
    accessToken,
  }: {
    type: string;
    days: 0 | 7 | 30;
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
          perPage: perPage || 5,
          type: type,
          sort: "TIME_DESC",
          showAdultContent: showAdultContent == true ? undefined : false,
          releasedOnLastXDays: days,
        },
      });

      return showAdultContent
        ? (data.results as AiringMediaResult[])
        : (filterMediasWithAdultContent(data.results) as AiringMediaResult[]);
    } catch (error) {
      console.log((error as Error).message);

      return null;
    }
  },

  // TRENDING 
  getTrendingMedia: async ({
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

      const authToken = headersCustom?.Authorization?.slice(8);

      const thisYear = new Date().getFullYear();

      const { data } = await axios({
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/medias/trending`,
        params: {
          authToken: authToken,
          sort: sort || "TRENDING_DESC",
          perPage: 20,
          showAdultContent: showAdultContent == true ? undefined : false,
          season: getCurrentSeason(),
          year: thisYear,
        },
      });

      return data.results as TrendingMediaResult[];

    } catch (error) {
      console.error((error as Error).message);

      return null;
    }
  },

  // MEDIAS WITH INDICATED FORMAT
  getMediaForThisFormat: async ({
    type,
    status,
    sort,
    pageNumber,
    perPage,
    showAdultContent,
    accessToken,
  }: {
    type: string;
    sort?: string;
    status?: string | string[];
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
        // url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/trending`,
        url: `${NEXT_PUBLIC_NEXT_BACKEND_URL}/medias/${type.toLowerCase()}/TV`,
        params: {
          authToken: authToken,
          page: pageNumber || 1,
          sort: sort || "TRENDING_DESC",
          status: status || undefined,
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
