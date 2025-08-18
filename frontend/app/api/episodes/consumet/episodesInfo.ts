import axios from "axios";
import { consumetProviders } from "../../consumetProviders";
import { EpisodeLinksGoGoAnime } from "@/app/ts/interfaces/gogoanimeData";

export async function consumetEpisodeByEpisodeId({
  episodeId,
  server,
  provider,
}: {
  episodeId: string;
  server?: string;
  provider?: string;
}) {
  if (provider) {
    if (!consumetProviders.find((item) => item == provider.toLowerCase())) {
      throw new Error(
        `Provider ${provider} is not supported. Supported providers: ${consumetProviders.join(", ")}`
      );
    }
  }

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
    .then((res) => res.data.results)

  return data;
}
