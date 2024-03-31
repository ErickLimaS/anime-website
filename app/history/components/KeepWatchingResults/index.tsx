"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { User, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import MediaItemCoverInfo from '@/app/components/MediaItemCoverInfo'
import UserModal from '@/app/components/UserLoginModal'
import SvgLoading from "@/public/assets/Eclipse-1s-200px.svg"

function KeepWatchingResults({ params }: { params?: { format: string, sort: string } }) {

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const [userKeepWatching, setUserKeepWatching] = useState<KeepWatchingItem[]>([])
    const [userFilteredKeepWatching, setUserFilteredKeepWatching] = useState<KeepWatchingItem[]>([])

    const searchParams = useSearchParams();

    // GETS KEEP WATCHING LIST ON USER DOC
    async function getPlaylist() {

        const db = getFirestore(initFirebase());

        let keepWatchingList = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("keepWatching"))

        let listFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = listFromObjectToArray.filter(item => item.length != 0 && item)

        if (params) {

            let filteredKeepWatching: KeepWatchingItem[] = keepWatchingList

            if (params?.format) filteredKeepWatching = filteredKeepWatching.filter(item => item.format.toUpperCase() == params.format.toUpperCase())

            if (params?.sort) {
                if (params.sort == "title_desc") filteredKeepWatching = filteredKeepWatching.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1)
                else if (params.sort == "title_asc") filteredKeepWatching = filteredKeepWatching.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1).reverse()
            }

            setUserFilteredKeepWatching(filteredKeepWatching)
            setUserKeepWatching(keepWatchingList)

            return
        }

        setUserFilteredKeepWatching([])
        setUserKeepWatching(keepWatchingList)

    }

    // HANDLES SELECT SORT CHANGES 
    useEffect(() => {
        let filteredBookmarks = !params?.format ? userKeepWatching : userFilteredKeepWatching

        if (params?.sort) {
            if (params.sort == "title_desc") filteredBookmarks = filteredBookmarks.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1)
            else if (params.sort == "title_asc") filteredBookmarks = filteredBookmarks.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1).reverse()
        }

        setUserFilteredKeepWatching(filteredBookmarks)
    }, [params?.sort])

    // RUNS WHEN HAS NO PARAMS 
    useEffect(() => {

        setUserFilteredKeepWatching([])

    }, [searchParams.size == 0])

    // HANDLES FORMAT SORT CHANGES 
    useEffect(() => {

        if (params?.format) {
            const filteredBookmarks = userKeepWatching.filter(item => item.format.toUpperCase() == params!.format.toUpperCase())
            console.log(filteredBookmarks)
            setUserFilteredKeepWatching(filteredBookmarks)

        }

    }, [params?.format])

    // IF USER IS NOT LOGGED IN, HE IS REDIRECTED TO LOGIN PAGE
    useEffect(() => {

        if (user?.uid) getPlaylist()

    }, [user])

    return (
        <>
            {(!user && !loading) && (

                <UserModal
                    auth={auth}
                />

            )}

            {loading ? (
                <div style={{ height: "400px", width: "100%", display: "flex" }}>
                    <SvgLoading width={120} height={120} style={{ margin: "auto" }} />
                </div>
            ) : (
                <div id={styles.container}>

                    <ul>
                        {params ? (
                            userFilteredKeepWatching.length > 0 ? (
                                userFilteredKeepWatching.map((item, key: number) => (
                                    <li key={key}>
                                        <MediaItemCoverInfo data={item as KeepWatchingItem} darkMode />
                                    </li>
                                ))
                            ) : (
                                <p style={{ color: "var(--white-100)" }}>No Results.</p>
                            )
                        ) : (
                            userKeepWatching.length > 0 ? (
                                userKeepWatching.map((item, key: number) => (
                                    <li key={key}>
                                        <MediaItemCoverInfo data={item as KeepWatchingItem} darkMode />
                                    </li>
                                ))
                            ) : (
                                <p style={{ color: "var(--white-100)" }}>No Results.</p>
                            )
                        )}
                    </ul>

                </div >
            )
            }
        </>
    )
}

export default KeepWatchingResults