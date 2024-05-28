"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { User, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import SvgLoading from "@/public/assets/Eclipse-1s-200px.svg"
import ShowUpLoginPanelAnimated from '@/app/components/UserLoginModal/animatedVariant'

function KeepWatchingResults({ params }: { params?: { format: string, sort: "title_desc" | "title_asc" } }) {

    const [keepWatchingList, setKeepWatchingList] = useState<KeepWatchingItem[]>([])
    const [filteredKeepWatchingList, setFilteredKeepWatchingList] = useState<KeepWatchingItem[]>([])

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const searchParams = useSearchParams()

    useEffect(() => { setFilteredKeepWatchingList([]) }, [searchParams.size == 0])

    useEffect(() => { if (user?.uid) getUserKeepWatching() }, [user])

    useEffect(() => {

        const sortType = params?.sort

        let filteredBookmarks = !params?.format ? keepWatchingList : filteredKeepWatchingList

        if (sortType) {
            if (sortType == "title_desc") filteredBookmarks = filteredBookmarks.sort((media1, media2) => media1.title.romaji > media2.title.romaji ? -1 : 1)
            else if (sortType == "title_asc") filteredBookmarks = filteredBookmarks.sort((media1, media2) => media1.title.romaji > media2.title.romaji ? -1 : 1).reverse()
        }

        setFilteredKeepWatchingList(filteredBookmarks)

    }, [params?.sort])

    useEffect(() => {

        const formatType = params?.format

        if (formatType) {

            const filteredBookmarks = keepWatchingList.filter(media => media.format.toUpperCase() == formatType.toUpperCase())

            setFilteredKeepWatchingList(filteredBookmarks)

        }

    }, [params?.format])

    async function getUserKeepWatching() {

        const db = getFirestore(initFirebase())

        let keepWatchingList = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("keepWatching"))

        let listFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = listFromObjectToArray.filter(item => item.length != 0 && item)

        if (!params) {

            setFilteredKeepWatchingList([])
            setKeepWatchingList(keepWatchingList)

            return

        }

        const formatType = params?.format

        const sortType = params?.sort

        let filteredKeepWatching: KeepWatchingItem[] = keepWatchingList

        if (formatType) filteredKeepWatching = filteredKeepWatching.filter(item => item.format.toUpperCase() == params.format.toUpperCase())

        if (sortType) {
            if (params.sort == "title_desc") {
                filteredKeepWatching = filteredKeepWatching.sort((media1, media2) => media1.title.romaji > media2.title.romaji ? -1 : 1)
            }
            else if (params.sort == "title_asc") {
                filteredKeepWatching = filteredKeepWatching.sort((media1, media2) => media1.title.romaji > media2.title.romaji ? -1 : 1).reverse()
            }
        }

        setFilteredKeepWatchingList(filteredKeepWatching)
        setKeepWatchingList(keepWatchingList)

    }

    return (
        <React.Fragment>

            <ShowUpLoginPanelAnimated
                apperanceCondition={(!user && !loading) ? true : false}
                auth={auth}
            />

            {loading && (
                <div style={{ height: "400px", width: "100%", display: "flex" }}>
                    <SvgLoading width={120} height={120} style={{ margin: "auto" }} />
                </div>
            )}

            {!loading && (
                <div id={styles.container}>

                    <ul>

                        {(filteredKeepWatchingList.length == 0 || keepWatchingList?.length == 0) && (
                            <p className={styles.no_results_text}>
                                No Results
                            </p>
                        )}

                        {params ? (
                            filteredKeepWatchingList.length > 0 && (filteredKeepWatchingList.map((media, key) => (
                                <li key={key}>

                                    <MediaCard.Container onDarkMode>

                                        <MediaCard.MediaImgLink
                                            mediaId={media.id}
                                            title={media.title.romaji}
                                            formatOrType={media.format}
                                            url={media.coverImage.extraLarge}
                                        />

                                        <MediaCard.LinkTitle
                                            title={media.title.romaji}
                                            id={media.id}
                                        />

                                    </MediaCard.Container>

                                </li>
                            )))
                        ) : (
                            keepWatchingList.map((media, key) => (
                                <li key={key}>

                                    <MediaCard.Container onDarkMode>

                                        <MediaCard.MediaImgLink
                                            mediaId={media.id}
                                            title={media.title.romaji}
                                            formatOrType={media.format}
                                            url={media.coverImage.extraLarge}
                                        />

                                        <MediaCard.LinkTitle
                                            title={media.title.romaji}
                                            id={media.id}
                                        />

                                    </MediaCard.Container>

                                </li>
                            ))
                        )}
                    </ul>

                </div >
            )
            }
        </React.Fragment>
    )
}

export default KeepWatchingResults