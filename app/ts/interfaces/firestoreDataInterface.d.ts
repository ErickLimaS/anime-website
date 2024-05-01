interface BookmarkItem {

    title: {
        romaji: string
    },
    format: string,
    description: string,
    coverImage: {
        extraLarge: string
    },
    id: number

}

interface Comment {

    username: string,
    userPhoto: string,
    comment: string,
    isSpoiler: boolean,
    createdAt: number,
    likes: number,
    dislikes: number,
    userId: {
        id: string
    },
    fromEpisode: boolean,
    episodeId: string,
    episodeNumber: number

}

interface KeepWatchingItem {

    title: {
        romaji: string
    },
    updatedAt: number,
    source: string,
    format: string,
    episode: string,
    episodeId: string,
    episodeImg: string,
    episodeTimeLastStop: number,
    episodeDuration: number,
    coverImage: {
        extraLarge: string,
        large: string
    },
    id: number

}

interface NotificationsCollectionFirebase {

    mediaId: string,
    isComplete: boolean,
    nextReleaseDate: number,
    title: {
        romaji: string,
        native: string
    },
    coverImage: {
        extraLarge: string,
        large: string
    },
    episodes: {
        number: number,
        releaseDate: number | null,
        wasReleased: boolean
    }[],
    lastUpdate: number,
    status: string | null

}

interface UserDocAssignedNotificationsFirebase {

    mediaId: string,
    lastEpisodeNotified: number,
    status: string,
    title: {
        romaji: string,
        native: string
    },

}