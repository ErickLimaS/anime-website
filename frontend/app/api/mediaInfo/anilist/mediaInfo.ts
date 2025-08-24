import { MediaDataFullInfo } from "@/app/ts/interfaces/anilistMediaData";
import { getHeadersWithAuthorization } from "../../anilist/anilistUsers";
import axios from "axios";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getMediaInfo({
  id,
  accessToken,
}: {
  id: number;
  accessToken?: string;
}) {
  try {
    const headersCustom = await getHeadersWithAuthorization({
      accessToken: accessToken,
    });

    const authToken = headersCustom?.Authorization?.slice(7);

    const { data }: { data: { result: MediaDataFullInfo } } = await axios({
      url: `${NEXT_PUBLIC_BACKEND_URL}/media-info/anime/anilist`,
      params: {
        query: id,
        authToken: authToken,
      },
    });

    return data.result;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error(`Failed to fetch media info for ID ${id}. ${(error as Error).message}`);
  }
}
