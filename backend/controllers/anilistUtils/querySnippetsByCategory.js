const queryTitles = `title{
                                romaji
                                native
                                english
                                userPreferred
                            }`;

const queryCoverImage = `coverImage {
                                        extraLarge
                                        large
                                        medium
                                        color
                            }`;

const queryMediaListEntry = `mediaListEntry {
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

const queryStudios = `studios(isMain: true){
                                    edges{
                                        node{
                                            name
                                            id
                                            isAnimationStudio
                                            siteUrl
                                        }
                                    }
                                }`;

const queryNextAiringEpisode = `nextAiringEpisode{
                                id
                                episode
                                airingAt
                            }`;

const queryRelatedMediasBasicInfo = `relations{
                                                nodes{
                                                    id
                                                    genres
                                                    type
                                                    format
                                                    ${queryTitles}
                                                    ${queryCoverImage}
                                                }
                                        }`;

const queryRelatedMediasFullInfo = `relations {
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

const queryRelatedMediasFullInfoUserAuthenticated = `relations {
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

const queryMediaTags = `tags{
                                    name
                                    description
                                    isAdult
                                    isMediaSpoiler
                                }`;

const queryCharacters = `characters(sort: [ROLE, FAVOURITES_DESC]){
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

const queryRecommendationsByCurrMedia = `recommendations{
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

const queryRecommendationsByCurrMediaUserAuthenticated = `recommendations{
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

const queryMediaReviews = `reviews {
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

module.exports = {
  queryTitles,
  queryCoverImage,
  queryMediaListEntry,
  queryStudios,
  queryNextAiringEpisode,
  queryRelatedMediasBasicInfo,
  queryRelatedMediasFullInfo,
  queryRelatedMediasFullInfoUserAuthenticated,
  queryMediaTags,
  queryCharacters,
  queryRecommendationsByCurrMedia,
  queryRecommendationsByCurrMediaUserAuthenticated,
  queryMediaReviews,
};
