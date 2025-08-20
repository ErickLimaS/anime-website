import { AniwatchMediaData } from "@/app/ts/interfaces/aniwatchData";
import axios from "axios";

export async function aniwatchSearchMedia({ query }: { query: string }) {
  const BACKEND_URI =
    process.env.NEXT_PUBLIC_BACKEND_URL + `/search/anime/aniwatch`;

  const data: AniwatchMediaData[] = await axios
    .get(BACKEND_URI, {
      params: {
        query: query,
      },
    })
    .then((res) => res.data.results);

  return data;
}
