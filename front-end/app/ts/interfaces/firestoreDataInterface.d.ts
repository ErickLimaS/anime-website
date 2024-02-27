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