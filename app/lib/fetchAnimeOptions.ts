import aniwatch from "@/app/api/aniwatch"
import { EpisodesFetchedAnimeWatch, MediaInfoAniwatch } from "../ts/interfaces/apiAnimewatchInterface"
import simulateRange from "./simulateRange"
import gogoanime from "@/app/api/consumetGoGoAnime"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from "../ts/interfaces/apiGogoanimeDataInterface"
import stringToOnlyAlphabetic from "./convertStringsTo"
import { checkAnilistTitleMisspelling } from "./checkApiMediaMisspelling"

export async function fetchWithGoGoAnime(textSearch: string, only?: "episodes") {

    const regexMediaTitle = stringToOnlyAlphabetic(checkAnilistTitleMisspelling(textSearch)).toLowerCase()

    let mediaSearched = await gogoanime.getInfoFromThisMedia({ id: regexMediaTitle }) as MediaInfo
    let searchResultsForMedia
    let filterBestResult

    // if no results were found by matching the id, search the title 
    if (!mediaSearched) {
        searchResultsForMedia = await gogoanime.searchMedia({ query: regexMediaTitle }) as MediaSearchResult[]

        // filter to closest title name to the query 
        filterBestResult = searchResultsForMedia.filter(item =>
            stringToOnlyAlphabetic(item.title).toLowerCase().indexOf(regexMediaTitle) !== -1
        )

        mediaSearched = await gogoanime.getInfoFromThisMedia({ id: filterBestResult[0]?.id || searchResultsForMedia![0]?.id }) as MediaInfo || null
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

export async function fetchWithAniWatch(textSearch: string, only?: "episodes" | "search_list", format?: string, mediaTotalEpisodes?: number, idToMatch?: string) {

    const regexMediaTitle = stringToOnlyAlphabetic(checkAnilistTitleMisspelling(textSearch)).toLowerCase()

    let searchResultsForMedia = await aniwatch.searchMedia({ query: regexMediaTitle }).then((res) => res!.animes) as MediaInfoAniwatch[]

    // filter the same format
    if (format) {
        const filterFormat = searchResultsForMedia.filter(item => item.type.toLowerCase() == format.toLowerCase())

        if (filterFormat.length > 0) {
            searchResultsForMedia = filterFormat
        }

    }

    let closestResult: MediaInfoAniwatch[] | undefined

    // filter to item which has the same media name 
    closestResult = searchResultsForMedia.filter(
        (item) => stringToOnlyAlphabetic(item.name).toLowerCase() == regexMediaTitle
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
            stringToOnlyAlphabetic(item.name).toLowerCase().includes(regexMediaTitle) || searchResultsForMedia[0]
        )
    }

    // if only EPISODES is requested
    if (only == "episodes") {

        if (closestResult.length == 0) return null

        let mediaAniwatchId = null

        // if ANIWATCH MEDIA ID is provided 
        if (idToMatch) mediaAniwatchId = closestResult.find(item => item.id == idToMatch)

        const res = await aniwatch.getEpisodes({ episodeId: mediaAniwatchId?.id || closestResult[0].id }) as EpisodesFetchedAnimeWatch

        return res?.episodes?.length == 0 ? null : res.episodes
    }

    return closestResult

}