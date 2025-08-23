import axios from "axios";
import { checkProviderValidity } from "../../consumetUtils";
import { GogoanimeMediaData } from "@/app/ts/interfaces/gogoanimeData";

export async function consumetMediaInfo({
  query,
  provider,
}: {
  query: string;
  provider?: string;
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
