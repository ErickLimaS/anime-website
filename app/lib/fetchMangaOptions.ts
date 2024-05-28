import manga from "@/app/api/consumetManga"
import { MangaSearchResult } from "../ts/interfaces/apiMangadexDataInterface"
import { ApiMediaResults } from "../ts/interfaces/apiAnilistDataInterface"

export async function getClosestMangaResultByTitle(query: string, mediaInfo: ApiMediaResults) {

    const searchResultsForMedia = await manga.searchMedia({ query: query }) as MangaSearchResult[]

    // FILTER RESULTS WITH SAME RELEASE YEAR
    const closestResult = searchResultsForMedia?.filter(
        item => item.releaseDate == mediaInfo.startDate.year
    ).sort(
        (a, b) => Number(a.lastChapter) - Number(b.lastChapter)
    ).reverse()

    // RETURNS RESULT WITH SAME TITLE, CHAPTERS or VOLUMES
    if (closestResult) {
        return closestResult.find(item => item.title.toLowerCase() == mediaInfo.title.romaji.toLowerCase())?.id
            ||
            closestResult.find(item => Number(item.lastChapter) == Number(mediaInfo.chapters))?.id
            ||
            closestResult.find(item => Number(item.lastVolume) == Number(mediaInfo.volumes))?.id
            ||
            closestResult[0].id
    }
    else {
        return searchResultsForMedia ? searchResultsForMedia[0]?.id : null
    }

}