import { ApiDefaultResult } from "./apiAnilistDataInterface"

interface BookmarkItem {

    title: ApiDefaultResult["title"],
    format: string,
    description: string,
    coverImage: {
        extraLarge: string
    },
    id: number

}

interface UserComment extends ReplyComment {

    likes: number,
    dislikes: number,
    fromEpisode: boolean | null,
    episodeId: string | null,
    episodeNumber: number | null

}

interface ReplyComment {

    username: string | undefined,
    userPhoto: string | undefined,
    comment: string,
    isSpoiler: boolean,
    createdAt: number,
    replies: UserComment[],
    userId: {
        id: string
    },

}

interface KeepWatchingItem {

    title: ApiDefaultResult["title"],
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
    title: ApiDefaultResult["title"],
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
    title: ApiDefaultResult["title"]

}