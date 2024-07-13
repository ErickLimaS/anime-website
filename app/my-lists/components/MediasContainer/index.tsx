"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import SvgLoading from "@/public/assets/Eclipse-1s-200px.svg"
import { useAppDispatch, useAppSelector } from '@/app/lib/redux/hooks'
import { KeepWatchingItem, ListItemOnMediasSaved } from '@/app/ts/interfaces/firestoreDataInterface'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { toggleShowLoginModalValue } from '@/app/lib/redux/features/loginModal'

type ComponentTypes = {

    mediaFetched: {
        name: string,
        status: string,
        entries: {
            id: number,
            userId: number,
            mediaId: number,
            media: ApiDefaultResult
        }[]
    }[] | undefined,
    params?: {
        format: string,
        type: "tv" | "movie" | "manga",
        sort: "title_desc" | "title_asc"
    }
}


export default function MediasContainer({ mediaFetched, params }: ComponentTypes) {

    const [keepWatchingList, setKeepWatchingList] = useState<KeepWatchingItem[]>([])
    const [userLists, setUserLists] = useState<{ name: string, medias: ListItemOnMediasSaved[] }[]>([])

    const anilistUser = useAppSelector((state) => (state.UserInfo)?.value)

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const dispatch = useAppDispatch()

    useEffect(() => { if (user?.uid || anilistUser?.id) getUserLists() }, [user, anilistUser])

    useEffect(() => { if ((!user && !anilistUser) && !loading) dispatch(toggleShowLoginModalValue()) }, [user, anilistUser, loading])

    async function getUserLists() {

        const db = getFirestore(initFirebase())
        const userDoc = await getDoc(doc(db, 'users', user?.uid || `${anilistUser?.id}`)).then(doc => doc.data())

        let keepWatchingListFromObjectToArray = Object.keys(userDoc!.keepWatching as []).map(key => {

            return userDoc!.keepWatching[key]

        })

        const keepWatchingList = keepWatchingListFromObjectToArray.filter(item => item.length != 0 && item)

        setKeepWatchingList(keepWatchingList)

        if (!anilistUser) {

            const activityLists: { name: string, medias: ListItemOnMediasSaved[] }[] = []

            Object.keys(userDoc!.mediaListSavedByStatus)?.map((list) => activityLists.push({
                name: list,
                medias: userDoc!.mediaListSavedByStatus[list]
            }))

            setUserLists(activityLists)

        }
    }

    return (

        <div id={styles.container}>

            {(params?.type == null || params?.type == "tv") && (

                <KeepWatchingListSection
                    keepWatchingList={keepWatchingList}
                    loading={loading}
                />

            )}

            {(user && userLists && params?.type != "MANGA".toLowerCase()) && (
                <MediasListOnUserDoc
                    userLists={userLists}
                />
            )}

            {anilistUser && mediaFetched && (
                <MediasListOnAnilist
                    mediaFetched={mediaFetched}
                />
            )}

        </div >

    )
}

function KeepWatchingListSection({ keepWatchingList, loading }: { keepWatchingList: KeepWatchingItem[], loading: boolean }) {

    return (

        <div className={styles.list_container} id="keep-watching">

            <h2>KEEP WATCHING</h2>

            {loading && (
                <div style={{ height: "400px", width: "100%", display: "flex" }}>
                    <SvgLoading width={120} height={120} style={{ margin: "auto" }} />
                </div>
            )}

            <ul>

                {!keepWatchingList && (
                    <li>
                        No media in keep watching list
                    </li>
                )}

                {keepWatchingList?.map((media) => (

                    <li key={media.id}>

                        <MediaCard.Container onDarkMode>

                            <MediaCard.MediaImgLink
                                hideOptionsButton
                                mediaInfo={media as any}
                                mediaId={media.id}
                                title={media.title.userPreferred}
                                formatOrType={media.format}
                                url={media.coverImage.extraLarge}
                            />

                            <MediaCard.LinkTitle
                                title={media.title.romaji}
                                id={media.id}
                            />

                        </MediaCard.Container>

                    </li>

                ))}

            </ul>
        </div>

    )

}

function MediasListOnUserDoc({ userLists }: { userLists: { name: string, medias: ListItemOnMediasSaved[] }[] }) {

    return (
        userLists?.map((list) => (

            <div key={list.name} className={styles.list_container} id={list.name.toLowerCase()}>

                <h2>{list.name == "current" ? "WATCHING" : list.name.toUpperCase()}</h2>

                <ul>
                    {list.medias.map((entrie, key) => (
                        <li key={key}>
                            <MediaCard.Container onDarkMode>

                                <MediaCard.MediaImgLink
                                    hideOptionsButton
                                    mediaInfo={entrie as ApiDefaultResult}
                                    mediaId={entrie.id}
                                    title={entrie.title.userPreferred}
                                    formatOrType={entrie.format}
                                    url={entrie.coverImage.extraLarge}
                                />

                                <MediaCard.LinkTitle
                                    title={entrie.title.romaji}
                                    id={entrie.id}
                                />

                            </MediaCard.Container>

                        </li>
                    ))}

                </ul>

            </div>

        ))
    )

}

function MediasListOnAnilist({ mediaFetched }: { mediaFetched: ComponentTypes["mediaFetched"] }) {

    return (

        mediaFetched!.map((list) => (

            <div key={list.name} className={styles.list_container} id={list.status?.toLowerCase() || "custom"}>

                <h2>{list.name.toUpperCase()}</h2>

                <ul>

                    {list.entries.map((entrie, key) => (
                        <li key={key}>

                            <MediaCard.Container onDarkMode>

                                <MediaCard.MediaImgLink
                                    mediaInfo={entrie.media as ApiDefaultResult}
                                    mediaId={entrie.media.id}
                                    title={entrie.media.title.userPreferred}
                                    formatOrType={entrie.media.format}
                                    url={entrie.media.coverImage.extraLarge}
                                />

                                <MediaCard.LinkTitle
                                    title={entrie.media.title.userPreferred}
                                    id={entrie.media.id}
                                />

                            </MediaCard.Container>

                        </li>
                    ))}

                </ul>

            </div>

        ))
    )
}