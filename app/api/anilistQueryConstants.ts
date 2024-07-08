
export const BASE_ANILIST_URL = 'https://graphql.anilist.co/'

// returns the current season when gets called
export function getCurrentSeason() {

    const mm = new Date().getMonth()
    const dd = new Date().getDate()

    switch (mm) {
        case 0:
            return 'WINTER'
        case 1:
            return 'WINTER'
        case 2:
            if (dd > 20) {
                return 'SPRING'
            }
            else {
                return 'WINTER'
            }
        case 3:
            return 'SPRING'
        case 4:
            return 'SPRING'
        case 5:
            if (dd > 21) {
                return 'SUMMER'
            }
            else {
                return 'SPRING'
            }
        case 6:
            return 'SUMMER'
        case 7:
            return 'SUMMER'
        case 8:
            if (dd > 22) {
                return 'FALL'
            }
            else {
                return 'SUMMER'
            }
        case 9:
            return 'FALL'
        case 10:
            return 'FALL'
        case 11:
            if (dd > 21) {
                return 'WINTER'
            }
            else {
                return 'FALL'
            }
        default:
            return 'SUMMER'
    }
}

export function defaultApiQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                $type: MediaType, 
                $format: MediaFormat, 
                $sort: [MediaSort], 
                $season: MediaSeason, 
                $seasonYear: Int, 
                $page: Int, 
                $perPage: Int, 
                $showAdultContent: Boolean
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                Page(page: $page, perPage: $perPage){
                    media (
                        season: $season, 
                        seasonYear: $seasonYear, 
                        sort: $sort, 
                        type: $type, 
                        format: $format, 
                        isAdult: $showAdultContent
                        ${otherMediasFields ? otherMediasFields : ''}
                    ){
                        title{
                                romaji
                                native
                                english
                                userPreferred
                            }
                            description(asHtml: true)
                            isAdult
                            isFavourite
                            mediaListEntry {
                                    id
                                    mediaId
                                    status
                                    progress
                                    media {
                                    title{
                                        romaji
                                    }
                                }
                            }
                            status
                            relations{
                                nodes{
                                    id
                                            type
                                            format
                                            title{
                                                romaji
                                                native
                                                english
                                                userPreferred
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                        }
                                    }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    
                                                    isFavourite
                                                    mediaListEntry {
                                                        id
                                                        mediaId
                                                        status
                                                        progress
                                                        media {
                                                        title{
                                                            romaji
                                                            }
                                                        }
                                                    }
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: ROLE){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActors{
                                                id
                                                name{
                                                    first
                                                    middle
                                                    last
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                description
                                                age
                                            }
                                            media{
                                                title{
                                                    romaji
                                                    native
                                                    english
                                                    userPreferred
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    type
                                                    format
                                                    title{
                                                        romaji
                                                        native
                                                        english
                                                        userPreferred
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                            studios{
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                            streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                            }
                            averageScore
                            nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                            }
                            startDate{
                                        year
                                        month
                                        day
                            }
                            endDate{
                                        year
                                        month
                                        day
                            }
                            season
                            seasonYear
                            isAdult
                            id
                            coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                            }
                            bannerImage
                            type
                            format
                            genres
                            popularity
                            averageScore
                        }
                    }
                }
            `
}

export function mediaByIdQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                    Media (
                        ${otherMediasFields ? otherMediasFields : ''}
                    ){
                            title{
                                romaji
                                native
                                english
                                userPreferred
                            }
                            description(asHtml: true)
                            isAdult
                            status
                            relations{
                                nodes{
                                    id
                                            type
                                            format
                                            title{
                                                romaji
                                                native
                                                english
                                                userPreferred
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                    }
                                }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: [ROLE, FAVOURITES_DESC]){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActorRoles(language: JAPANESE){
                                                voiceActor{
                                                    id
                                                    name{
                                                        first
                                                        middle
                                                        last
                                                        full
                                                        native
                                                        alternative
                                                    }
                                                    image{
                                                        large
                                                        medium
                                                    }
                                                    description
                                                    age
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    seasonYear
                                                    genres
                                                    type
                                                    format
                                                    title{
                                                        romaji
                                                        native
                                                        english
                                                        userPreferred
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                            studios(isMain: true){
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                            streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                            }
                            relations {
                                edges {
                                    id
                                    relationType
                                    isMainStudio
                                    characterRole
                                    characterName
                                    roleNotes
                                    dubGroup
                                    staffRole
                                    favouriteOrder
                                    node {
                                        id
                                        genres
                                        idMal
                                        type
                                        format
                                        status
                                        description
                                        season
                                        seasonYear
                                        seasonInt
                                        episodes
                                        duration
                                        chapters
                                        volumes
                                        countryOfOrigin
                                        isLicensed
                                        source
                                        hashtag
                                        updatedAt
                                        bannerImage
                                        genres
                                        synonyms
                                        averageScore
                                        meanScore
                                        popularity
                                        isLocked
                                        trending
                                        favourites
                                        isFavourite
                                        isFavouriteBlocked
                                        isAdult
                                        siteUrl
                                        autoCreateForumThread
                                        isRecommendationBlocked
                                        isReviewBlocked
                                        modNotes
                                    }
                                }
                                nodes {
                                    id
                                    idMal
                                    type
                                    genres
                                    format
                                    status
                                    description
                                    season
                                    seasonYear
                                    seasonInt
                                    episodes
                                    duration
                                    chapters
                                    volumes
                                    countryOfOrigin
                                    isLicensed
                                    source
                                    hashtag
                                    updatedAt
                                    bannerImage
                                    genres
                                    synonyms
                                    averageScore
                                    meanScore
                                    popularity
                                    isLocked
                                    trending
                                    favourites
                                    isFavourite
                                    isFavouriteBlocked
                                    isAdult
                                    siteUrl
                                    autoCreateForumThread
                                    isRecommendationBlocked
                                    isReviewBlocked
                                    modNotes
                                }
                            }
                            averageScore
                            nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                }
                                startDate{
                                        year
                                        month
                                        day
                                }
                                endDate{
                                        year
                                        month
                                        day
                                }
                            season
                            seasonYear
                            isAdult
                            id
                            coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                            }
                            bannerImage
                            type
                            hashtag
                            favourites
                            trending
                            format
                            genres
                            popularity
                            averageScore
                        }
                }
                
            `
}

export function queryMediaWithUserAuthenticated(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                    Media (
                        ${otherMediasFields ? otherMediasFields : ''}
                    ){
                            title{
                                romaji
                                native
                                english
                                userPreferred
                            }
                            description(asHtml: true)
                            isAdult
                            status
                            isFavourite
                            mediaListEntry {
                                id
                                mediaId
                                status
                                progress
                                media {
                                title{
                                    romaji
                                    }
                                }
                            }
                            relations{
                                nodes{
                                    id
                                            type
                                            format
                                            title{
                                                romaji
                                                native
                                                english
                                                userPreferred
                                            }
                                            coverImage{
                                                large
                                                extraLarge
                                                medium
                                            }
                                    }
                                }
                                    episodes
                                    chapters
                                    volumes
                                    duration
                                    source
                                    countryOfOrigin
                                    trailer{
                                        id
                                        site
                                        thumbnail
                                    }
                                    updatedAt
                                    favourites
                                    tags{
                                        name
                                        description
                                        isAdult
                                        isMediaSpoiler
                                    }
                                    characters(sort: [ROLE, FAVOURITES_DESC]){
                                        edges{
                                            id
                                            role
                                            node{
                                                name{
                                                    full
                                                    native
                                                    alternative
                                                }
                                                image{
                                                    large
                                                    medium
                                                }
                                                gender
                                                age
                                            }
                                            voiceActorRoles(language: JAPANESE){
                                                voiceActor{
                                                    id
                                                    name{
                                                        first
                                                        middle
                                                        last
                                                        full
                                                        native
                                                        alternative
                                                    }
                                                    image{
                                                        large
                                                        medium
                                                    }
                                                    description
                                                    age
                                                }
                                            }
                                        }
                                    }
                                    recommendations{
                                        edges{
                                            node{
                                                id
                                                mediaRecommendation{
                                                    id
                                                    seasonYear
                                                    genres
                                                    type
                                                    format
                                                    description
                                                    isFavourite
                                                    mediaListEntry {
                                                        id
                                                        mediaId
                                                        status
                                                        progress
                                                        media {
                                                        title{
                                                            romaji
                                                            }
                                                        }
                                                    }
                                                    title{
                                                        romaji
                                                        native
                                                        english
                                                        userPreferred
                                                    }
                                                    coverImage{
                                                        extraLarge
                                                        large
                                                        medium
                                                        color
                                                    }
                                                }
                                            }
                                        }
                                    }
                            studios(isMain: true){
                                        edges{
                                            node{
                                                name
                                                id
                                                isAnimationStudio
                                                siteUrl
                                            }
                                        }
                                    }
                            streamingEpisodes{
                                        title
                                        thumbnail
                                        url
                                        site
                            }
                            relations {
                                edges {
                                    id
                                    relationType
                                    isMainStudio
                                    characterRole
                                    characterName
                                    roleNotes
                                    dubGroup
                                    staffRole
                                    favouriteOrder
                                    node {
                                        id
                                        genres
                                        idMal
                                        type
                                        format
                                        status
                                        description
                                        season
                                        seasonYear
                                        seasonInt
                                        episodes
                                        duration
                                        chapters
                                        volumes
                                        countryOfOrigin
                                        isLicensed
                                        source
                                        hashtag
                                        updatedAt
                                        bannerImage
                                        genres
                                        synonyms
                                        averageScore
                                        meanScore
                                        popularity
                                        isLocked
                                        trending
                                        favourites
                                        isFavourite
                                        isFavouriteBlocked
                                        isAdult
                                        siteUrl
                                        autoCreateForumThread
                                        isRecommendationBlocked
                                        isReviewBlocked
                                        modNotes
                                    }
                                }
                                nodes {
                                    id
                                    idMal
                                    type
                                    genres
                                    format
                                    status
                                    description
                                    season
                                    seasonYear
                                    seasonInt
                                    episodes
                                    duration
                                    chapters
                                    volumes
                                    countryOfOrigin
                                    isLicensed
                                    mediaListEntry {
                                                        id
                                                        mediaId
                                                        status
                                                        progress
                                                        media {
                                                        title{
                                                            romaji
                                                            }
                                                        }
                                    }
                                    source
                                    hashtag
                                    updatedAt
                                    bannerImage
                                    genres
                                    synonyms
                                    averageScore
                                    meanScore
                                    popularity
                                    isLocked
                                    trending
                                    favourites
                                    isFavourite
                                    isFavouriteBlocked
                                    isAdult
                                    siteUrl
                                    autoCreateForumThread
                                    isRecommendationBlocked
                                    isReviewBlocked
                                    modNotes
                                }
                            }
                            averageScore
                            nextAiringEpisode{
                                        id
                                        episode
                                        airingAt
                                }
                                startDate{
                                        year
                                        month
                                        day
                                }
                                endDate{
                                        year
                                        month
                                        day
                                }
                            season
                            seasonYear
                            isAdult
                            id
                            coverImage{
                                        extraLarge
                                        large
                                        medium
                                        color
                            }
                            bannerImage
                            type
                            hashtag
                            favourites
                            trending
                            format
                            genres
                            popularity
                            averageScore
                        }
                }
                
            `
}

export function mediaAiringApiQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query(
                $page: Int,
                $sort: [AiringSort],
                $perPage: Int
                ${otherQueryFields ? otherQueryFields : ''}
            ) {
                Page(page: $page, perPage: $perPage){
                    airingSchedules(sort: $sort ${otherMediasFields ? otherMediasFields : ''}) {
                            id
                            airingAt
                            timeUntilAiring
                            episode
                            mediaId
                            media {
                                id
                                idMal
                                isAdult
                                description
                                title {
                                    romaji,
                                    native
                                    english
                                    userPreferred
                                }id
                                coverImage{
                                    extraLarge
                                    large
                                    medium
                                    color
                                }
                                trailer{
                                    id
                                    site
                                    thumbnail
                                }
                                bannerImage
                                type
                                format
                                status
                                description
                                season
                                seasonYear
                                seasonInt
                                episodes
                                duration
                                chapters
                                volumes
                                countryOfOrigin
                                isLicensed
                                source
                                hashtag
                                updatedAt
                                bannerImage
                                genres
                                synonyms
                                averageScore
                                meanScore
                                popularity
                                isLocked
                                trending
                                favourites
                                isFavourite
                                isFavouriteBlocked
                                isAdult
                                siteUrl
                                autoCreateForumThread
                                isRecommendationBlocked
                                isReviewBlocked
                                modNotes
                            }
                        }
                    }
                }
            `
}

export function mediaTrendingApiQueryRequest(otherQueryFields?: unknown, otherMediasFields?: unknown) {

    return `query Page (
                $page: Int,
                $sort: [MediaTrendSort],
                $perPage: Int
                ${otherQueryFields ? otherQueryFields : ''}) {
        Page (page: $page, perPage: $perPage){
            mediaTrends(sort: $sort ${otherMediasFields ? otherMediasFields : ''}) {
                mediaId
                date
                trending
                averageScore
                inProgress
                releasing
                episode
                popularity
                media {
                    id
                    idMal
                    isAdult
                    title {
                        romaji
                        native
                        english
                        userPreferred
                    }
                    id
                    coverImage{
                    extraLarge
                    large
                    medium
                    color
                    }
                    trailer{
                        id
                        site
                        thumbnail
                    }
                    bannerImage
                    type
                    format
                    status
                    description
                    season
                    seasonYear
                    seasonInt
                    episodes
                    duration
                    chapters
                    volumes
                    countryOfOrigin
                    isLicensed
                    source
                    hashtag
                    updatedAt
                    bannerImage
                    genres
                    synonyms
                    averageScore
                    meanScore
                    popularity
                    isLocked
                    trending
                    favourites
                    isFavourite
                    isFavouriteBlocked
                    isAdult
                    siteUrl
                    autoCreateForumThread
                    isRecommendationBlocked
                    isReviewBlocked
                    modNotes
                }
            }
        }
    }
    `
}
