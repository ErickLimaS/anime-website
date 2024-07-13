export interface ApiDefaultResult {
    title: {
        romaji: string,
        native: string,
        english: string,
        userPreferred: string
    },
    startDate: {
        year: number,
        month: number,
        day: number,
    },
    endDate: {
        year: number,
        month: number,
        day: number,
    },
    nextAiringEpisode: {
        airingAt: number,
        episode: number
    },
    status: string | null,
    description: string,
    episodes: number,
    duration: number,
    season: string,
    seasonYear: number,
    isAdult: Boolean,
    id: number,
    isFavourite: boolean,
    mediaListEntry: {
        id: number,
        mediaId: number,
        status: "COMPLETED" | "CURRENT" | "PLANNING" | "DROPPED" | "PAUSED" | "REPEATING",
        progress: number,
        media: {
            title: {
                romaji: string,
            }
        }
    },
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
    type: "ANIME" | "MANGA",
    format: string,
    genres: string[],
    trending: number,
    popularity: number,
    averageScore: number,
}

export interface ApiAiringMidiaResults {
    popularity: number,

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

export interface EpisodesType {
    site: string,
    url: string,
    thumbnail: string,
    title: string,
}

export interface ApiMediaResults extends ApiDefaultResult {

    hashtag: string,
    favourites: number,
    source: string,
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
    streamingEpisodes: EpisodesType[]
    studios: {
        edges: [{
            node: {
                name: string,
                id: number
                isAnimationStudio: boolean,
                siteUrl: string
            }
        }]
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
