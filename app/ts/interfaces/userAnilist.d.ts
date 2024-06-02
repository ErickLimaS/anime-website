interface UserAnilist {

    isUserFromAnilist?: boolean,
    id: number,
    name: string,
    createdAt: number,
    avatar: {
        large: string,
        medium: string
    },
    options: {
        displayAdultContent: boolean,
        titleLanguage: string
    }

}