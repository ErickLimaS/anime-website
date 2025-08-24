import axios from "axios";
import { checkProviderValidity } from "../../consumetUtils";
import { GogoanimeMediaData } from "@/app/ts/interfaces/gogoanimeData";
import { SourceType } from "@/app/ts/interfaces/episodesSource";

export async function consumetMediaInfo({
  query,
  provider,
}: {
  query: string;
  provider?:Omit<SourceType["source"], "crunchyroll" | "anilist" | "aniwatch">;
}) {
  if (provider) checkProviderValidity(provider);

  const BACKEND_URI =
    process.env.NEXT_PUBLIC_BACKEND_URL +
    `/media-info/anime/consumet/${provider || "gogoanime"}`;

  const data: GogoanimeMediaData = await axios
    .get(BACKEND_URI, {
      params: {
        query: query,
      },
    })
    .then((res) => res.data.result);

  return data;
}
