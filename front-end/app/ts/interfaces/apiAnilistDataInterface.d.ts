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

export interface ApiMediaResults extends ApiDefaultResult {

    status: string | null,
    duration: number | null,
    volumes: number | null,
    chapters: number | null,
    characters: {
        edges: [{
            id: number,
            node: {
                image: {
                    large: string,
                    medium: string
                },
                name: {
                    full: string
                }
            },
            voiceActorRoles: [{
                voiceActor: {
                    id: number,
                    image: {
                        large: string,
                        medium: string
                    }, 
                    name: {
                        full: string
                    }
                }
            }]
        }]
    },
    streamingEpisodes: [{
        site: string,
        url: string,
        thumbnail: string,
        title: string,
    }]
    studios: {
        edges: {
            node: {
                name: string,
                id: number
                isAnimationStudio: boolean,
                siteUrl: string
            }
        }
    },
    relations: {
        nodes: ApiDefaultResult[]
    },
    recommendations: {
        edges: [{
            node: {
                mediaRecommendation: ApiDefaultResult
            }
        }]
    }

}