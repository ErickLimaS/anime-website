import {
  MangadexMangaChapters,
  MangadexMangaPages,
  MangadexMangaSearchResult,
} from "@/app/ts/interfaces/mangadex";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // SEARCH MANGA BY QUERY/TITLE
  searchMedia: async ({ query, page }: { query: string; page?: number }) => {
    try {
      const data: MangadexMangaSearchResult[] = await axios({
        url: `${NEXT_PUBLIC_BACKEND_URL}/search/manga/consumet/mangadex/${query}${page ? `?page=${page} ` : ""}`,
        method: "GET",
      }).then((res) => res.data.results);

      if (!data || data.length === 0) {
        throw new Error("No results found");
      }

      return data;
    } catch (error) {
      console.error("Mangadex: " + error);
    }
  },

  // GET MANGA INFO
  getMangaChapters: async ({ id }: { id: string | number }) => {
    try {
      const data: MangadexMangaChapters[] = await axios({
        url: `${NEXT_PUBLIC_BACKEND_URL}/chapters/consumet/mangadex/all?id=${id}`,
        method: "GET",
      }).then((res) => res.data.results);

      // sort ASC chapters
      const dataSorted = data.sort(
        (a, b) => Number(a.chapterNumber) - Number(b.chapterNumber)
      );

      if (!dataSorted || dataSorted.length === 0) {
        throw new Error("No results found");
      }

      return dataSorted;
    } catch (error) {
      console.error(error);

      return null;
    }
  },

  // GET PAGES FOR MANGA CHAPTER
  getChapterPages: async ({ chapterId }: { chapterId: string }) => {
    try {
      const data: MangadexMangaPages[] = await axios({
        url: `${NEXT_PUBLIC_BACKEND_URL}/chapters/consumet/mangadex/chapter?id=${chapterId}`,
        method: "GET",
      }).then((res) => res.data.results);

      if (!data || data.length === 0) {
        throw new Error("No results found");
      }

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
};
