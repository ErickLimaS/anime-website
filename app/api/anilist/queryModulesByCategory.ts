export const queryTitles = `title{
                                romaji
                                native
                                english
                                userPreferred
                            }`;

export const queryCoverImage = `coverImage {
                                        extraLarge
                                        large
                                        medium
                                        color
                            }`;

export const queryMediaListEntry = `mediaListEntry {
                                    id
                                    mediaId
                                    status
                                    progress
                                    media {
                                    title{
                                        romaji
                                    }
                                }
                            }`;

export const queryStudios = `studios(isMain: true){
                                    edges{
                                        node{
                                            name
                                            id
                                            isAnimationStudio
                                            siteUrl
                                        }
                                    }
                                }`;

export const queryNextAiringEpisode = `nextAiringEpisode{
                                id
                                episode
                                airingAt
                            }`;

export const queryRelatedMediasBasicInfo = `relations{
                                                nodes{
                                                    id
                                                    genres
                                                    type
                                                    format
                                                    ${queryTitles}
                                                    ${queryCoverImage}
                                                }
                                        }`;

export const queryRelatedMediasFullInfo = `relations {
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
                            }`;

export const queryRelatedMediasFullInfoUserAuthenticated = `relations {
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
                                    ${queryMediaListEntry}
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
                            }`;

export const queryMediaTags = `tags{
                                    name
                                    description
                                    isAdult
                                    isMediaSpoiler
                                }`;

export const queryCharacters = `characters(sort: [ROLE, FAVOURITES_DESC]){
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
                                    }`;

export const queryRecommendationsByCurrMedia = `recommendations{
                                                    edges{
                                                        node{
                                                            id
                                                            mediaRecommendation{
                                                                id
                                                                genres
                                                                type
                                                                format
                                                                ${queryTitles}
                                                                ${queryCoverImage}
                                                            }
                                                        }
                                                    }
                            }`;

export const queryRecommendationsByCurrMediaUserAuthenticated = `recommendations{
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
                                                    ${queryMediaListEntry}
                                                    ${queryTitles}
                                                    ${queryCoverImage}
                                                }
                                            }
                                        }
                                    }`;

export const queryMediaReviews = `reviews {
                                        nodes {
                                            id
                                            summary
                                            body(asHtml: true)
                                            rating
                                            userRating
                                            ratingAmount
                                            score
                                            user {
                                                id
                                                name
                                                about
                                                avatar {
                                                    large
                                                    medium
                                                }
                                                bannerImage
                                            }
                                        }
                                    }
                                    `;
