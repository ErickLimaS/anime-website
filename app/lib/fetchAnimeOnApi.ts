import aniwatch from "@/api/aniwatch"
import { EpisodesFetchedAnimeWatch, MediaInfoAniwatch, MediaInfoFetchedAnimeWatch } from "../ts/interfaces/apiAnimewatchInterface"
import regexOnlyAlphabetic from "./regexOnlyAlphabetic"
import simulateRange from "./simulateRange"
import gogoanime from "@/api/gogoanime"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from "../ts/interfaces/apiGogoanimeDataInterface"

export async function fetchWithGoGoAnime(textSearch: string, only?: "episodes") {

    const regexMediaTitle = regexOnlyAlphabetic(textSearch).toLowerCase()

    const searchResultsForMedia = await gogoanime.searchMedia(regexMediaTitle, "anime") as MediaSearchResult[]

    const filterBestResult = searchResultsForMedia.filter(item =>
        regexOnlyAlphabetic(item.title).toLowerCase().indexOf(regexMediaTitle) !== -1
    )

    const res = await gogoanime.getInfoFromThisMedia(filterBestResult[0]?.id || searchResultsForMedia[0]?.id, "anime") as MediaInfo || null

    if (!res) return null

    if (only == "episodes") {

        let episodes: any[] = []

        simulateRange(res.totalEpisodes).map((item, key) => {
            episodes.push({
                number: key + 1,
                id: `${res!.id.toLowerCase()}-episode-${key + 1}`,
                url: ""
            })
        })

        return res.episodes.length == 0 ? episodes as MediaEpisodes[] : res.episodes

    }

    return res

}

export async function fetchWithAniWatch(textSearch: string, only?: "episodes") {

    const regexMediaTitle = regexOnlyAlphabetic(textSearch).toLowerCase()

    const searchResultsForMedia = await aniwatch.searchMedia(regexMediaTitle).then((res: void | MediaInfoFetchedAnimeWatch) => res!.animes) as MediaInfoAniwatch[]

    const closestResult: MediaInfoAniwatch = searchResultsForMedia.find((item) => regexOnlyAlphabetic(item.name).toLowerCase().includes(regexMediaTitle)) || searchResultsForMedia[0]

    if (only == "episodes") {
        const res = await aniwatch.getEpisodes(closestResult.id) as EpisodesFetchedAnimeWatch

        return res.episodes.length == 0 ? null : res.episodes
    }

    return closestResult

}