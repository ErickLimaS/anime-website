export interface MediaInfo {

    id: string,
    title: string,
    url: string,
    genres: string[],
    totalEpisode: number,
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