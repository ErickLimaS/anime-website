import {
  EpisodeAnimeWatch,
  EpisodeLinksAnimeWatch,
} from "@/app/ts/interfaces/aniwatchData";
import axios from "axios";

export async function getAniwatchMediaEpisodes({ query }: { query: string }) {
  const BACKEND_URI =
    process.env.NEXT_PUBLIC_BACKEND_URL + "/episodes/aniwatch/all";

  const data: EpisodeAnimeWatch[] = await axios
    .get(BACKEND_URI, {
      params: {
        query: query,
      },
    })
    .then((res) => res.data.results);

  return data;
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

  return data;
}
