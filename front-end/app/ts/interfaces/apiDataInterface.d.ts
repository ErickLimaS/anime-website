export interface ApiDefaultResult {
    title: {
        romaji: string,
        native: string,
    },
    startDate: {
        year: number,
        month: number,
        day: number,
    },
    description: string,
    episodes: number,
    season: string,
    seasonYear: number,
    isAdult: Boolean,
    id: number,
    trailer: {
        id: string,
    }
    coverImage: {
        extraLarge: string | StaticImport,
        large: string | StaticImport,
        medium: string | StaticImport,
        color: string | StaticImport,
    },
    bannerImage: string | StaticImport,
    type: string,
    format: string,
    genres: string[],
    trending: number,
    popularity: number,
    averageScore: number,
}

export interface ApiAiringMidiaResults {

    airingAt: number,
    episode: number,
    id: number,
    media: ApiDefaultResult,
    mediaId: number,
    timeUntilAiring: number,

}


export interface ApiTrendingMidiaResults {

    date: number,
    trending: number,
    averageScore: number,
    inProgress: number,
    releasing: boolean,
    episode: number,
    popularity: number,
    media: ApiDefaultResult,
    mediaId: number,

}