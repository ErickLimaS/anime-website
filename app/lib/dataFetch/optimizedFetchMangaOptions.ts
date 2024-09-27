import manga from "@/app/api/consumet/consumetManga";
import { MangadexMangaSearchResult } from "../../ts/interfaces/mangadex";
import { MediaDataFullInfo } from "../../ts/interfaces/anilistMediaData";

export async function getClosestMangaResultByTitle(
  query: string,
  mediaInfo: MediaDataFullInfo
) {
  const searchResultsForMedia = (await manga.searchMedia({
    query: query,
  })) as MangadexMangaSearchResult[];

  // FILTER RESULTS WITH SAME RELEASE YEAR
  const closestResults = searchResultsForMedia
    ?.filter((item) => item.releaseDate == mediaInfo.startDate.year)
    .sort((a, b) => Number(a.lastChapter) - Number(b.lastChapter))
    .reverse();

  // RETURNS RESULT WITH SAME TITLE, CHAPTERS or VOLUMES
  const resultByTitle = closestResults.find(
    (item) => item.title.toLowerCase() == mediaInfo.title.english.toLowerCase()
  )?.id;
  const resultByChapter = closestResults.find(
    (item) => Number(item.lastChapter) == Number(mediaInfo.chapters)
  )?.id;
  const resultByVolumes = closestResults.find(
    (item) => Number(item.lastVolume) == Number(mediaInfo.volumes)
  )?.id;

  if (closestResults) {
    return (
      resultByTitle ||
      resultByChapter ||
      resultByVolumes ||
      closestResults[0].id
    );
  }

  return searchResultsForMedia ? searchResultsForMedia[0]?.id : null;
}
