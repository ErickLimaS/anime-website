import { MediaOnJSONFile } from "@/app/ts/interfaces/jsonMediaData";
import axios from "axios";

type SearchParamsTypes = {
  type?: string;
  title?: string;
  genre?: string[];
  year?: number;
  status?: string;
  page?: string;
  sort?: string;
  season?: string;
};

type AnimeDatabaseSearchResponse = {
  message: string;
  results: MediaOnJSONFile[];
  lastUpdate: string;
  allResultsLength: number;
};

export async function animeDatabaseSearchMedias({
  searchParams,
}: {
  searchParams: SearchParamsTypes;
}) {
  const BACKEND_URI =
    process.env.NEXT_PUBLIC_BACKEND_URL + `/search/media/anime-database`;

  try {
    const data: AnimeDatabaseSearchResponse = await axios
      .get(BACKEND_URI, {
        params: {
          type: searchParams.type,
          title: searchParams.title,
          year: searchParams.year,
          genre: searchParams.genre,
          status: searchParams.status,
          page: searchParams.page,
          sort: searchParams.sort,
          season: searchParams.season,
        },
      })
      .then((res) => res.data);

    return data;
  } catch (error) {
    console.error("Error fetching anime database search results:", error);
    throw new Error("Anime Database search failed", { cause: error });
  }
}
