import stringToOnlyAlphabetic from "@/app/lib/convertStrings";
import { ImdbMediaInfo, ImdbSearchItem } from "@/app/ts/interfaces/imdb";
import axios from "axios";

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URL;

// SEARCH BY MEDIA TITLE
export const searchMediaOnIMDB = async ({
  mediaTitle,
}: {
  mediaTitle: string;
}) => {
  try {
    const { data } = await axios({
      url: `${BACKEND_URI}/imdb/search?query=${mediaTitle}`,
      method: "GET",
    });

    return data;
  } catch (err) {
    console.log(err);

    return null;
  }
};

// GET INFO FOR THIS MEDIA
export const getMediaInfoOnIMDB = async ({
  search,
  mediaId,
  type,
  seachTitle,
  releaseYear,
}: {
  search: boolean;
  mediaId?: string;
  type?: "TV Series";
  seachTitle?: string;
  releaseYear?: number;
}) => {
  try {
    let mediaSearchedId: number | null = null;
    let mediaSearchedType: string | null = null;

    if (search && seachTitle) {
      const searchResults: ImdbSearchItem[] = await searchMediaOnIMDB({
        mediaTitle: stringToOnlyAlphabetic(seachTitle),
      }).then((res) => res.results);

      const filteredRes = searchResults.find(
        (item) => Number(item.releaseDate) == releaseYear
      );

      mediaSearchedId = filteredRes?.id || searchResults[0].id;
      mediaSearchedType = filteredRes?.type || searchResults[0].type;
    }

    const { data }: { data: ImdbMediaInfo } = await axios({
      url: `${BACKEND_URI}/imdb/media-info?query=${mediaSearchedId || mediaId}&type=${mediaSearchedType || type}`,
      method: "GET",
    });

    return data;
  } catch (err) {
    console.log(err);

    return null;
  }
};
