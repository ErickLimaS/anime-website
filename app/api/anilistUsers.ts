import Axios from "axios";
import { cache } from "react";
import { BASE_ANILIST_URL } from "./anilistQueryConstants";
import axiosRetry from "axios-retry";
import { createNewUserDocument } from "../lib/firebaseUserActions/userLoginActions";

async function getHeadersWithAuthorization({ accessToken }: { accessToken?: string }) {

    const { data } = await Axios({
        url: `${window.location.origin}/api/anilist`,
        method: "GET"
    })

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken ? accessToken : data.access_token}`,
        'Accept': 'application/json',
    }

}

axiosRetry(Axios, {
    retries: 2,
    retryDelay: (retryAttempt) => retryAttempt * 2000,
    retryCondition: (error) => error.response?.status == 400 || error.response?.status == 500 || error.response?.status == 503,
    onRetry: (retryNumber) => console.log(`retry: ${retryNumber} ${retryNumber == 2 ? " - Last Attempt" : ""}`)
})

// eslint-disable-next-line import/no-anonymous-default-export
export default {

    getUserDataByID: cache(async ({ userId }: { userId: number }) => {

        try {

            const graphqlQuery = {
                "query": `
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
                "variables": {
                    'id': userId
                }
            }

            const { data } = await Axios({
                url: `${BASE_ANILIST_URL}`,
                method: 'POST',
                headers: await getHeadersWithAuthorization({ accessToken: undefined }),
                data: graphqlQuery
            })

            return data

        }
        catch (err) {

            console.log(err)

            return err

        }

    }),

    getCurrUserData: cache(async ({ accessToken }: { accessToken?: string }) => {

        try {

            const graphqlQuery = {
                "query": `
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
            }

            const { data } = await Axios({
                url: `${BASE_ANILIST_URL}`,
                method: 'POST',
                headers: await getHeadersWithAuthorization({ accessToken: accessToken }),
                data: graphqlQuery
            })

            const userDataFromAnilist = data.data.Viewer

            const userDocFetchedOrCreated = await createNewUserDocument({ userAnilist: userDataFromAnilist }) as UserAnilist

            return userDocFetchedOrCreated || undefined

        }
        catch (err) {

            console.log(err)

            return undefined

        }

    }),

}