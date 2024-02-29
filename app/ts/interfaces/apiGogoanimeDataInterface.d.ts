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

export interface MangaInfo {

    id: string,
    title: string,
    rating: number,
    chapters: MangaChapters[]

}

export interface MangaSearchResult {

    id: string,
    title: string,
    headerForImage: {
        Referer: string,
    },
    image: string,
    description: string,
    status: string,

}

export interface MangaChapters {

    id: string,
    title: string,
    releasedDate: string

}

export interface MangaPages {

    page: number,
    img: string,
    headerForImage: {
        Referer: string
    }

}

export interface EpisodeLinks {

    headers: {
        Referer: string,
    },
    sources: Episode[],
    download: string
    
}

export interface Episode {
    url: string,
    isM3U8: boolean,
    quality: string
}