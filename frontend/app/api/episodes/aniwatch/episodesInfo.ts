import {
  EpisodeAnimeWatch,
  EpisodeLinksAnimeWatch,
} from "@/app/ts/interfaces/aniwatchData";
import axios from "axios";

export async function getAniwatchMediaEpisodes({ query }: { query: string }) {
  try {
    const BACKEND_URI =
      process.env.NEXT_PUBLIC_BACKEND_URL + "/episodes/aniwatch/all";

    const data: EpisodeAnimeWatch[] = await axios
      .get(BACKEND_URI, {
        params: {
          id: query,
        },
      })
      .then((res) => res.data.results);

    return data;
  } catch (error) {
    console.error("Error fetching Aniwatch media episodes:", error);
    throw new Error("Failed to fetch media episodes from Aniwatch.");
  }
}

export async function getAniwatchEpisodeByEpisodeId({
  episodeId,
  server,
  category,
}: {
  episodeId: string;
  server?: string;
  category?: string;
}) {
  try {
    const BACKEND_URI =
      process.env.NEXT_PUBLIC_BACKEND_URL + "/episodes/aniwatch/episode";

    const data: EpisodeLinksAnimeWatch = await axios
      .get(BACKEND_URI, {
        params: {
          id: episodeId,
          server: server || null,
          category: category || null,
        },
      })
      .then((res) => res.data.results);

    if (!data) {
      throw new Error(
        "Failed to fetch episode data from Aniwatch. No data returned."
      );
    }
    if (data.sources?.length == 0) {
      throw new Error(
        "Failed to fetch episode data from Aniwatch. No sources found."
      );
    }

    return data;
  } catch (error) {
    console.error(error);
  }
}
