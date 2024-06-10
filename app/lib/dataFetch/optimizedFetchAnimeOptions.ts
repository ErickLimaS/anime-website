import aniwatch from "@/app/api/aniwatch"
import { EpisodesFetchedAnimeWatch, MediaInfoAniwatch } from "../../ts/interfaces/apiAnimewatchInterface"
import simulateRange from "../simulateRange"
import gogoanime from "@/app/api/consumetGoGoAnime"
import { MediaEpisodes, MediaInfo, MediaSearchResult } from "../../ts/interfaces/apiGogoanimeDataInterface"
import stringToOnlyAlphabetic from "../convertStrings"
import { checkAnilistTitleMisspelling } from "../checkApiMediaMisspelling"

// Always tries to give at least one result that resembles the query
export async function optimizedFetchOnGoGoAnime({ textToSearch, only, isDubbed }: { textToSearch: string, only?: "episodes", isDubbed?: boolean }) {

    const titleFixed = stringToOnlyAlphabetic(checkAnilistTitleMisspelling(textToSearch)).toLowerCase()

    let mediaInfo = await gogoanime.getInfoFromThisMedia({ id: titleFixed }) as MediaInfo

    if (mediaInfo && !only) return mediaInfo

    const resultsForMediaSearch = await gogoanime.searchMedia({ query: titleFixed }) as MediaSearchResult[]

    let closestResultsByMediaTitle

    if (isDubbed) {
        closestResultsByMediaTitle = resultsForMediaSearch.filter(
            media => media.subOrDub == "dub"
        )
    }
    else {
        closestResultsByMediaTitle = resultsForMediaSearch.filter(
            media => stringToOnlyAlphabetic(media.title).toLowerCase().indexOf(titleFixed) !== -1
        )
    }

    mediaInfo = await gogoanime.getInfoFromThisMedia({ id: closestResultsByMediaTitle[0]?.id || resultsForMediaSearch![0]?.id }) as MediaInfo || null

    if (!mediaInfo) return null

    if (only == "episodes") {

        let episodesList: MediaEpisodes[] = []

        simulateRange(mediaInfo.totalEpisodes).map((item, key) => {
            episodesList.push({
                number: key + 1,
                id: `${mediaInfo!.id.toLowerCase()}-episode-${key + 1}`,
                url: ""
            })
        })

        return mediaInfo.episodes.length == 0 ? episodesList : mediaInfo.episodes

    }

    return mediaInfo

}

// Always tries to give at least one result that resembles the query
export async function optimizedFetchOnAniwatch({ textToSearch, only, format, mediaTotalEpisodes, idToMatch, isDubbed }:
    { textToSearch: string, only?: "episodes" | "search_list", format?: string, mediaTotalEpisodes?: number, idToMatch?: string, isDubbed?: boolean }) {

    const titleFixed = stringToOnlyAlphabetic(checkAnilistTitleMisspelling(textToSearch)).toLowerCase()

    let resultsForMediaSearch = await aniwatch.searchMedia({ query: titleFixed }).then((res) => res!.animes) as MediaInfoAniwatch[]

    if (format) {

        const filterFormat = resultsForMediaSearch.filter(media => media.type.toLowerCase() == format.toLowerCase())

        if (filterFormat.length > 0) resultsForMediaSearch = filterFormat

    }

    let mediasWithSameTitle: MediaInfoAniwatch[] | undefined = resultsForMediaSearch.filter(
        (media) => stringToOnlyAlphabetic(media.name).toLowerCase() == titleFixed
    )

    if (only == "search_list" && mediasWithSameTitle.length != 0) return mediasWithSameTitle

    mediasWithSameTitle = mediasWithSameTitle.length == 0 ? resultsForMediaSearch : mediasWithSameTitle

    if (mediaTotalEpisodes) {

        const mediaWithSameEpisodesAmount = mediasWithSameTitle.filter(
            (media) => media.episodes.sub == mediaTotalEpisodes
        )

        if (mediaWithSameEpisodesAmount.length != 0) mediasWithSameTitle = mediaWithSameEpisodesAmount

    }

    if (only == "search_list") return mediasWithSameTitle.length > 0 ? mediasWithSameTitle : resultsForMediaSearch

    if (mediasWithSameTitle.length == 0) {

        mediasWithSameTitle = resultsForMediaSearch.filter((media) =>
            stringToOnlyAlphabetic(media.name).toLowerCase().includes(titleFixed) || resultsForMediaSearch[0]
        )

    }

    if (only == "episodes") {

        if (mediasWithSameTitle.length == 0) return null

        let mediaFoundByID = null

        // if ANIWATCH MEDIA ID is provided 
        if (idToMatch) mediaFoundByID = mediasWithSameTitle.find(media => media.id == idToMatch)

        const mediaEpisodesList = await aniwatch.getEpisodes({ episodeId: mediaFoundByID?.id || mediasWithSameTitle[0].id }) as EpisodesFetchedAnimeWatch

        return mediaEpisodesList?.episodes?.length == 0 ? null : {

            episodesDub: mediaFoundByID?.episodes?.dub || mediasWithSameTitle[0]?.episodes?.dub || 0,
            episodesSub: mediaFoundByID?.episodes?.sub || mediasWithSameTitle[0]?.episodes?.sub || 0,
            episodes: mediaEpisodesList.episodes

        }

    }

    return mediasWithSameTitle

}