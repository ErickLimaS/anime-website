"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { User, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import * as MediaCard from '@/app/components/MediaCards/MediaCard'
import UserModal from '@/app/components/UserLoginModal'
import SvgLoading from "@/public/assets/Eclipse-1s-200px.svg"

function PlaylistItemsResults({ params }: { params?: { format: string, sort: string } }) {

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const [userBookmarks, setUserBookmarks] = useState<BookmarkItem[]>([])
    const [userFilteredBookmarks, setUserFilteredBookmarks] = useState<BookmarkItem[]>([])

    const searchParams = useSearchParams();

    // GETS BOOKMARKS ON USER DOCUMENT
    async function getUserBookmarks() {

        const db = getFirestore(initFirebase());

        const bookmarks: BookmarkItem[] = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("bookmarks"))

        if (params) {

            let filteredBookmarks = bookmarks

            if (params?.format) filteredBookmarks = filteredBookmarks.filter(item => item.format == params.format.toUpperCase())

            if (params?.sort) {
                if (params.sort == "title_desc") filteredBookmarks = filteredBookmarks.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1)
                else if (params.sort == "title_asc") filteredBookmarks = filteredBookmarks.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1).reverse()
            }

            setUserFilteredBookmarks(filteredBookmarks)
            setUserBookmarks(bookmarks)

            return
        }

        setUserFilteredBookmarks([])
        setUserBookmarks(bookmarks)

    }

    // HANDLES SELECT SORT CHANGES 
    useEffect(() => {
        let filteredBookmarks = !params?.format ? userBookmarks : userFilteredBookmarks

        if (params?.sort) {
            if (params.sort == "title_desc") filteredBookmarks = filteredBookmarks.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1)
            else if (params.sort == "title_asc") filteredBookmarks = filteredBookmarks.sort((a, b) => a.title.romaji > b.title.romaji ? -1 : 1).reverse()
        }

        setUserFilteredBookmarks(filteredBookmarks)
    }, [params?.sort])

    // RUNS WHEN HAS NO PARAMS 
    useEffect(() => {

        setUserFilteredBookmarks([])

    }, [searchParams.size == 0])

    // HANDLES FORMAT SORT CHANGES 
    useEffect(() => {

        if (params?.format) {
            const filteredBookmarks = userBookmarks.filter(item => item.format == params!.format.toUpperCase())

            setUserFilteredBookmarks(filteredBookmarks)
        }

    }, [params?.format])

    // ONLY RUNS WHEN USER IS LOGGED IN
    useEffect(() => {

        if (user?.uid) getUserBookmarks()

    }, [user])

    return (
        <>

            {/* IF USER IS NOT LOGGED IN */}
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
                userBookmarks?.length > 0 ? (
                    <div id={styles.container}>

                        <ul>

                            {params ? (
                                userFilteredBookmarks.length > 0 ? (
                                    userFilteredBookmarks.map((media, key) => (
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
                                    :
                                    (
                                        <p className={styles.no_results_text}>No Results</p>
                                    )
                            ) : (
                                userBookmarks.map((media, key) => (
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
                            }

                        </ul>

                    </div>
                ) : (
                    <p className={styles.no_results_text}>No Results</p>
                )
            )}
        </>
    )
}

export default PlaylistItemsResults