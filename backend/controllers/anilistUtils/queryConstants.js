const {
  queryCharacters,
  queryCoverImage,
  queryMediaListEntry,
  queryMediaReviews,
  queryMediaTags,
  queryNextAiringEpisode,
  queryRecommendationsByCurrMedia,
  queryRecommendationsByCurrMediaUserAuthenticated,
  queryRelatedMediasBasicInfo,
  queryRelatedMediasFullInfoUserAuthenticated,
  queryStudios,
  queryTitles,
} = require("./querySnippetsByCategory");

// General Medias Query for various routes
function requestMedias(
  otherQueryFields,
  otherMediasFields
) {
  return `query(
                $type: MediaType, 
                $format: MediaFormat, 
                $sort: [MediaSort], 
                $season: MediaSeason, 
                $seasonYear: Int, 
                $page: Int, 
                $perPage: Int, 
                $showAdultContent: Boolean,
                $status: MediaStatus
                ${otherQueryFields ? otherQueryFields : ""}
            ) {
                Page(page: $page, perPage: $perPage){
                    media (
                        season: $season, 
                        seasonYear: $seasonYear, 
                        sort: $sort, 
                        type: $type, 
                        format: $format, 
                        isAdult: $showAdultContent,
                        status: $status
                        ${otherMediasFields ? otherMediasFields : ""}
                    ){
                            ${queryTitles}
                            description(asHtml: true)
                            isAdult
                            isFavourite
                            ${queryMediaListEntry}
                            status
                            ${queryMediaReviews}
                            ${queryRelatedMediasBasicInfo}
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
                            ${queryMediaTags}
                            ${queryCharacters}
                            ${queryRecommendationsByCurrMedia}
                            ${queryStudios}
                            streamingEpisodes{
                                title
                                thumbnail
                                url
                                site
                            }
                            averageScore
                            ${queryNextAiringEpisode}
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
                            ${queryCoverImage}
                            bannerImage
                            type
                            format
                            genres
                            popularity
                            averageScore
                        }
                    }
                }
            `;
}

// Media By ID Query for Media Info Route
function requestMediaById(isUserAuthenticated) {
  return `query($id: Int) {
                    Media (id: $id){
                            ${queryTitles}
                            description(asHtml: true)
                            isAdult
                            status
                            isFavourite
                            ${queryMediaReviews}
                            ${queryMediaListEntry}
                            ${queryRelatedMediasBasicInfo}
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
                            ${queryMediaTags}
                            ${queryCharacters}
                            ${
                              isUserAuthenticated
                                ? queryRecommendationsByCurrMediaUserAuthenticated
                                : queryRecommendationsByCurrMedia
                            }
                            ${queryStudios}
                            streamingEpisodes{
                                title
                                thumbnail
                                url
                                site
                            }
                            ${
                              isUserAuthenticated
                                ? queryRelatedMediasFullInfoUserAuthenticated
                                : queryRelatedMediasBasicInfo
                            }
                            averageScore
                            ${queryNextAiringEpisode}
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
                            ${queryCoverImage}
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
                
            `;
}

// Medias By Date Release Query 
function requestMediasByDateRelease() {
  return `query(
                $page: Int,
                $sort: [AiringSort],
                $perPage: Int, 
                $airingAt_greater: Int, 
                $airingAt_lesser: Int
            ) {
                Page(page: $page, perPage: $perPage){
                    airingSchedules(sort: $sort, airingAt_greater: $airingAt_greater, airingAt_lesser: $airingAt_lesser) {
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
                                ${queryMediaReviews}
                                ${queryTitles}
                                id
                                ${queryCoverImage}
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
            `;
}

// Medias Trends Query for Trending Route
function requestMediasByTrendingSort() {
  return `query Page (
                $page: Int,
                $sort: [MediaTrendSort],
                $perPage: Int
                ) {
        Page (page: $page, perPage: $perPage){
            mediaTrends(sort: $sort) {
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
                    ${queryTitles}
                    id
                    ${queryMediaReviews}
                    ${queryCoverImage}
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
    `;
}

module.exports = {
  requestMedias,
  requestMediaById,
  requestMediasByDateRelease,
  requestMediasByTrendingSort,
};
