export interface MediaInfoFetchedAnimeWatch {

    animes: MediaInfoAniwatch[]

}

export interface MediaInfoAniwatch {
    id: string,
    name: string,
    poster: string,
    duration: string,
    type: string,
    rating: number | null,
    episodes: {
        sub: number,
        dub: number
    }
}

export interface EpisodeLinksAnimeWatch {

    tracks: [{
        file: string,
        label: string,
        kind: string,
        default: boolean
    }],
    intro: {
        start: number,
        end: number,
    },
    outro: {
        start: number,
        end: number,
    },
    sources: [
        {
            url: string,
            type: string
        }
    ]
}

export interface EpisodesFetchedAnimeWatch {

    totalEpisodes: number,
    episodes: EpisodeAnimeWatch[]

}

export interface EpisodeAnimeWatch {

    title: string,
    episodeId: string,
    number: number,
    isFiller: boolean

}