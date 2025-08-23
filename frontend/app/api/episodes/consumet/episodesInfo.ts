import axios from "axios";
import { consumetProviders } from "../../consumetProviders";
import { EpisodeLinksGoGoAnime } from "@/app/ts/interfaces/gogoanimeData";
import { SourceType } from "@/app/ts/interfaces/episodesSource";

export async function consumetEpisodeByEpisodeId({
  episodeId,
  server,
  provider,
}: {
  episodeId: string;
  server?: string;
  provider?: Omit<SourceType["source"], "crunchyroll" | "anilist" | "aniwatch">;
}) {
  if (provider) {
    if (!consumetProviders.find((item) => item == provider.toLowerCase())) {
      throw new Error(
        `Provider ${provider} is not supported. Supported providers: ${consumetProviders.join(", ")}`
      );
    }
  }

  try {
    // alternative: /meta/anilist
    const BACKEND_URI =
      process.env.NEXT_PUBLIC_BACKEND_URL +
      `/episodes/consumet/${provider ? provider : "gogoanime"}/episode`;

    const data: EpisodeLinksGoGoAnime = await axios
      .get(BACKEND_URI, {
        params: {
          id: episodeId,
          server: server || null,
        },
      })
      .then((res) => res.data.results);

    if (!data) {
      throw new Error("Failed to fetch episode data. No data returned.");
    }
    if (data.sources?.length == 0) {
      throw new Error(
        `No episode data found for the given ID. No sources found.`
      );
      return null;
    }

    return data;
  } catch (error) {
    console.error(`${provider}:`, error);
  }
}
