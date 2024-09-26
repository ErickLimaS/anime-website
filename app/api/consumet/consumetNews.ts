import { News } from "@/app/ts/interfaces/newsInterface";
import Axios from "axios";
import axiosRetry from "axios-retry";
import { cache } from "react";

const CONSUMET_API_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL;

// HANDLES SERVER ERRORS, most of time when server was not running due to be using the Free Tier
axiosRetry(Axios, {
  retries: 3,
  retryDelay: (retryAttempt) => retryAttempt * 2000,
  retryCondition: (error) =>
    error.response?.status == 500 || error.response?.status == 503,
  onRetry: (retryNumber) =>
    console.log(
      `retry: ${retryNumber} ${retryNumber == 3 ? " - Last Attempt" : ""}`
    ),
});

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // GET ALL NEWS, OR NEWS BY TOPIC
  getNews: cache(async ({ topic }: { topic?: string }) => {
    try {
      const { data } = await Axios({
        url: `${CONSUMET_API_URL}/news/ann/recent-feeds${topic ? `?topic=${topic}` : ""}`,
        method: "GET",
      });

      return data as News[];
    } catch (err) {
      console.log(err);

      return null;
    }
  }),

  // GET NEWS ARTICLE BY ID
  getNewsInfo: cache(async ({ id }: { id: string }) => {
    try {
      const { data } = await Axios({
        url: `${CONSUMET_API_URL}/news/ann/info?id=${id}`,
        method: "GET",
      });

      return data as News;
    } catch (err) {
      console.log(err);

      return err;
    }
  }),
};
