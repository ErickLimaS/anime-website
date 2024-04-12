export interface MediaInfo {

    id: string,
    title: string,
    url: string,
    genres: string[],
    totalEpisodes: number,
    image: string,
    release: string,
    description: string,
    status: string,
    episodes: MediaEpisodes[],
    fromOtherSource?: boolean

}

export interface MediaEpisodes {

    id: string,
    number: number,
    url: string,

}

export interface MediaSearchResult {

    id: string,
    title: string,
    url: string,
    image: string,
    releaseDate: string,
    subOrDub: string

}

export interface EpisodeLinksGoGoAnime {

    headers: {
        Referer: string,
    },
    sources: Episode[],
    download: string

}

export interface EpisodeGoGoAnime {

    url: string,
    isM3U8: boolean,
    quality: string

}