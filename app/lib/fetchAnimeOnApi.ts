import aniwatch from "@/api/aniwatch"
import { EpisodesFetchedAnimeWatch, MediaInfoAniwatch, MediaInfoFetchedAnimeWatch } from "../ts/interfaces/apiAnimewatchInterface"
import regexOnlyAlphabetic from "./regexOnlyAlphabetic"
import simulateRange from "./simulateRange"
import gogoanime from "@/api/gogoanime"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from "../ts/interfaces/apiGogoanimeDataInterface"
import { checkApiMisspellingMedias } from "./checkApiMediaMisspelling"

export async function fetchWithGoGoAnime(textSearch: string, only?: "episodes") {

    const regexMediaTitle = regexOnlyAlphabetic(checkApiMisspellingMedias(textSearch)).toLowerCase()

    let mediaSearched = await gogoanime.getInfoFromThisMedia(regexMediaTitle, "anime") as MediaInfo
    let searchResultsForMedia
    let filterBestResult

    // if no results were found by matching the id, search the title 
    if (!mediaSearched) {
        searchResultsForMedia = await gogoanime.searchMedia(regexMediaTitle, "anime") as MediaSearchResult[]

        // filter to closest title name to the query 
        filterBestResult = searchResultsForMedia.filter(item =>
            regexOnlyAlphabetic(item.title).toLowerCase().indexOf(regexMediaTitle) !== -1
        )

        mediaSearched = await gogoanime.getInfoFromThisMedia(filterBestResult[0]?.id || searchResultsForMedia![0]?.id, "anime") as MediaInfo || null
    }

    if (!mediaSearched) return null

    // if only EPISODES is requested
    if (only == "episodes") {

        let episodes: any[] = []

        simulateRange(mediaSearched.totalEpisodes).map((item, key) => {
            episodes.push({
                number: key + 1,
                id: `${mediaSearched!.id.toLowerCase()}-episode-${key + 1}`,
                url: ""
            })
        })

        return mediaSearched.episodes.length == 0 ? episodes as MediaEpisodes[] : mediaSearched.episodes

    }

    return mediaSearched

}

export async function fetchWithAniWatch(textSearch: string, only?: "episodes" | "search_list", format?: string, mediaTotalEpisodes?: number) {

    const regexMediaTitle = regexOnlyAlphabetic(checkApiMisspellingMedias(textSearch)).toLowerCase()

    let searchResultsForMedia = await aniwatch.searchMedia(regexMediaTitle).then((res) => res!.animes) as MediaInfoAniwatch[]

    // filter the same format
    if (format) {
        searchResultsForMedia = searchResultsForMedia.filter(item => item.type.toLowerCase() == format.toLowerCase())
    }

    let closestResult: MediaInfoAniwatch[] | undefined

    // filter to item which has the same media name 
    closestResult = searchResultsForMedia.filter(
        (item) => regexOnlyAlphabetic(item.name).toLowerCase() == regexMediaTitle
    )

    // if is only SEARCH LIST is requested
    if (only == "search_list") {
        if (closestResult.length != 0) {
            return closestResult
        }
    }
    else {
        closestResult = closestResult.length == 0 ? searchResultsForMedia : closestResult
    }

    // filter which has the same ammount of episodes
    if (mediaTotalEpisodes) {
        const filter = closestResult.filter(
            (item) => item.episodes.sub == mediaTotalEpisodes
        )

        if (filter.length != 0) closestResult = filter
    }

    // if is only SEARCH LIST is requested
    if (only == "search_list") {

        return closestResult.length > 0 ? closestResult : searchResultsForMedia

    }

    // filter closest title result
    if (!closestResult) {
        closestResult = searchResultsForMedia.filter((item) =>
            regexOnlyAlphabetic(item.name).toLowerCase().includes(regexMediaTitle) || searchResultsForMedia[0]
        )
    }

    // if only EPISODES is requested
    if (only == "episodes") {

        if (!closestResult) return null

        const res = await aniwatch.getEpisodes(closestResult[0].id) as EpisodesFetchedAnimeWatch

        return res?.episodes?.length == 0 ? null : res.episodes
    }

    return closestResult

}