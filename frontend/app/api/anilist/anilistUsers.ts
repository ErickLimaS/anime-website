import Axios from "axios";
import { cache } from "react";
import { createNewUserDocument } from "../../lib/user/userLoginActions";
import userSettingsActions from "../cookie/userCookieSettingsActions";

const ANILIST_URL = process.env.NEXT_PUBLIC_ANILIST_API_URL;

export async function getHeadersWithAuthorization({
  accessToken,
}: {
  accessToken?: string;
}) {
  if (accessToken) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };
  }

  try {
    const { data } = await Axios({
      url: `${process.env.NEXT_PUBLIC_WEBSITE_ORIGIN_URL}/api/anilist`,
      method: "GET",
    });

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.access_token}`,
      Accept: "application/json",
    };
  } catch {
    return {
      "Content-Type": "application/json",
    };
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getUserDataByID: cache(async ({ userId }: { userId: number }) => {
    try {
      const graphqlQuery = {
        query: `
                    query($id: Int) {
                        User(id: $id){
                            id
                            name
                            bannerImage
                            createdAt
                            avatar {
                                large
                                medium
                            }
                            favourites {
                                anime {
                                    nodes {
                                        title {
                                            romaji
                                            english
                                            native
                                        }
                                    }
                                }
                                manga {
                                    nodes {
                                        title {
                                            romaji
                                            english
                                            native
                                        }
                                    }
                                }
                            }
                            statistics {
                                anime {
                                    minutesWatched
                                }
                                manga {
                                    chaptersRead
                                }
                            }
                        }
                    }
                `,
        variables: {
          id: userId,
        },
      };

      const { data } = await Axios({
        url: `${ANILIST_URL}`,
        method: "POST",
        headers: await getHeadersWithAuthorization({ accessToken: undefined }),
        data: graphqlQuery,
      });

      return data;
    } catch (err) {
      console.error(err);

      return err;
    }
  }),

  getCurrUserData: cache(
    async ({
      accessToken,
      getOnlyId,
    }: {
      accessToken?: string;
      getOnlyId?: boolean;
    }) => {
      try {
        const graphqlQuery = {
          query: `
                    query {

                        Viewer {
                            id
                            name
                            about
                            bannerImage
                            createdAt
                            avatar {
                                large
                                medium
                            }
                            options {
                                titleLanguage 
                                displayAdultContent
                                activityMergeTime
                            }
                            favourites {
                                anime {
                                    nodes {
                                        id
                                        title {
                                            romaji
                                        }
                                        format
                                        description
                                        coverImage {
                                            extraLarge
                                            large
                                        }
                                    }
                                }
                                manga {
                                    nodes {
                                        id
                                        title {
                                            romaji
                                        }
                                        format
                                        description
                                        coverImage {
                                            extraLarge
                                            large
                                        }
                                    }
                                }
                            }
                            statistics {
                                anime {
                                    minutesWatched
                                }
                                manga {
                                    chaptersRead
                                }
                            }
                        }

                    }
                `,
        };

        const { data } = await Axios({
          url: `${ANILIST_URL}`,
          method: "POST",
          headers: await getHeadersWithAuthorization({
            accessToken: accessToken,
          }),
          data: graphqlQuery,
        });

        const userDataFromAnilist = data.data.Viewer;

        if (getOnlyId) return userDataFromAnilist.id;

        const userDocFetchedOrCreated = (await createNewUserDocument({
          userAnilist: userDataFromAnilist,
        })) as UserAnilist;

        return userDocFetchedOrCreated || undefined;
      } catch (err) {
        console.error(err);

        return undefined;
      }
    }
  ),

  getCurrUserLists: cache(
    async ({
      accessToken,
      userId,
      mediaType,
    }: {
      userId: number;
      mediaType: "ANIME" | "MANGA";
      accessToken?: string;
    }) => {
      try {
        const graphqlQuery = {
          query: `
                    query ($userId: Int, $type: MediaType){
                        MediaListCollection (userId: $userId, type: $type) {
                            user {
                                id
                                name
                            }
                            lists {
                                name
                                status
                                entries {
                                    id
                                    userId
                                    mediaId
                                    media {
                                        id
                                        title {
                                            userPreferred
                                            romaji
                                            english
                                            native
                                        }
                                        coverImage{
                                            extraLarge
                                            large
                                            medium
                                            color
                                        }
                                        description
                                        type
                                        format
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
                                        bannerImage
                                        season
                                        seasonYear
                                        startDate{
                                            year
                                            month
                                            day
                                        }
                                    }
                                }
                            }

                        }

                    }
                `,
          variables: {
            userId: userId,
            type: mediaType.toUpperCase(),
          },
        };

        const { data } = await Axios({
          url: `${ANILIST_URL}`,
          method: "POST",
          headers: await getHeadersWithAuthorization({
            accessToken: accessToken,
          }),
          data: graphqlQuery,
        });

        const userDataFromAnilist = data.data.MediaListCollection;

        return userDataFromAnilist;
      } catch (error) {
        console.error((error as Error).message);

        return (error as Error).message;
      }
    }
  ),

  addOrRemoveFromAnilistFavourites: async ({
    format,
    mediaId,
  }: {
    format: "anime" | "manga";
    mediaId: number;
  }) => {
    try {
      const graphqlQuery = {
        query: `mutation ($id: Int) {
                    ToggleFavourite (animeId: $id){
                        ${format} {
                            nodes {
                                id
                                title {
                                    romaji
                                }
                            }
                        }
                    }
                }`,
        variables: {
          id: mediaId,
        },
      };

      const { data } = await Axios({
        url: `${ANILIST_URL}`,
        method: "POST",
        headers: await getHeadersWithAuthorization({}),
        data: graphqlQuery,
      });

      return data;
    } catch (err) {
      console.error(err);

      return null;
    }
  },

  addMediaToSelectedList: async ({
    status,
    mediaId,
    episodeOrChapterNumber,
    numberWatchedOrReadUntilNow,
  }: {
    status:
      | "COMPLETED"
      | "CURRENT"
      | "PLANNING"
      | "DROPPED"
      | "PAUSED"
      | "REPEATING";
    mediaId: number;
    episodeOrChapterNumber?: number;
    numberWatchedOrReadUntilNow?: number;
  }) => {
    try {
      const graphqlQuery = {
        query: `mutation ($mediaId: Int, $status: MediaListStatus, $progress: Int) {
                    SaveMediaListEntry (mediaId: $mediaId, status: $status, progress: $progress){
                        id
                        status
                        progress
                        media {
                            title {
                                romaji
                            }
                        }
                    }
                }`,
        variables: {
          mediaId: mediaId,
          status: status,
          progress: episodeOrChapterNumber || numberWatchedOrReadUntilNow || 0,
        },
      };

      const { data } = await Axios({
        url: `${ANILIST_URL}`,
        method: "POST",
        headers: await getHeadersWithAuthorization({}),
        data: graphqlQuery,
      });

      return data;
    } catch (err) {
      console.error(err);

      return null;
    }
  },

  removeMediaFromSelectedList: async ({
    listItemEntryId,
  }: {
    listItemEntryId: number;
  }) => {
    try {
      const graphqlQuery = {
        query: `mutation ($id: Int) {
                    DeleteMediaListEntry (id: $id){
                        deleted
                    }
                }`,
        variables: {
          id: listItemEntryId,
        },
      };

      const { data } = await Axios({
        url: `${ANILIST_URL}`,
        method: "POST",
        headers: await getHeadersWithAuthorization({}),
        data: graphqlQuery,
      });

      return data;
    } catch (err) {
      console.log(err);

      return null;
    }
  },

  handleMediaTitleLanguageSetting: async ({ lang }: { lang?: string }) => {
    try {
      const cookieSetResult =
        await userSettingsActions.setMediaTitleLanguageCookie({ lang: lang });

      const graphqlQuery = {
        query: `mutation ($lang: UserTitleLanguage) {
                    UpdateUser (titleLanguage: $lang){
                        options{
                            titleLanguage
                        }
                    }
                }`,
        variables: {
          lang: lang?.toUpperCase(),
        },
      };

      await Axios({
        url: `${ANILIST_URL}`,
        method: "POST",
        headers: await getHeadersWithAuthorization({}),
        data: graphqlQuery,
      });

      return cookieSetResult;
    } catch (err) {
      console.error(err);

      return null;
    }
  },

  handleAdultContentSetting: async ({ isEnabled }: { isEnabled?: string }) => {
    try {
      const cookieSetResult = await userSettingsActions.setAdultContentCookie({
        isEnabled: isEnabled,
      });

      const graphqlQuery = {
        query: `mutation ($isEnabled: Boolean) {
                    UpdateUser (displayAdultContent: $isEnabled){
                        options{
                            displayAdultContent
                        }
                    }
                }`,
        variables: {
          isEnabled: isEnabled == "true",
        },
      };

      await Axios({
        url: `${ANILIST_URL}`,
        method: "POST",
        headers: await getHeadersWithAuthorization({}),
        data: graphqlQuery,
      });

      return cookieSetResult;
    } catch (err) {
      console.error(err);

      return null;
    }
  },

  handleSubtitleLanguageSetting: async ({ lang }: { lang?: string }) => {
    try {
      const cookieSetResult =
        await userSettingsActions.setSubtitleLanguageCookie({ lang: lang });

      return cookieSetResult;
    } catch (err) {
      console.log(err);

      return null;
    }
  },

  handlePlayWrongMediaSetting: async ({
    isEnabled,
  }: {
    isEnabled?: string;
  }) => {
    try {
      const cookieSetResult = await userSettingsActions.setPlayWrongMediaCookie(
        { playWrongMedia: isEnabled }
      );

      return cookieSetResult;
    } catch (err) {
      console.error(err);

      return null;
    }
  },
};
