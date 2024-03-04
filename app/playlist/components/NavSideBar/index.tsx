"use client"
import Link from 'next/link'
import React, { useLayoutEffect, useState } from 'react'
import styles from "./component.module.css"
import { User, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'

function NavSideBar({ params }: { params?: { format: string } }) {

    const [currentParam, setCurrentParam] = useState("")
    const [bookmarksLength, setBookmarksLength] = useState<{ all: number, anime: number, manga: number, movie: number }>()

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    async function fetchData() {

        const bookmarks: BookmarkItem[] = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("bookmarks"))

        setBookmarksLength(
            {
                all: bookmarks.length,
                anime: bookmarks.filter((item) => item.format == "TV").length,
                manga: bookmarks.filter((item) => item.format == "MANGA").length,
                movie: bookmarks.filter((item) => item.format == "MOVIE").length
            }
        )

    }

    useLayoutEffect(() => {

        if (!loading && user) fetchData()

        setCurrentParam(params?.format || "")

    }, [loading, params])

    return (
        <>
            <p>FORMAT</p>

            <nav id={styles.nav_container}>
                <ul>
                    <li data-active={currentParam == ""}>
                        <Link href={`/playlist`}>All {bookmarksLength && (<span>({bookmarksLength.all})</span>)}</Link>
                    </li>
                    <li data-active={currentParam == "tv"}>
                        <Link href={`?format=tv`}>Animes {bookmarksLength && (<span>({bookmarksLength.anime})</span>)}</Link>
                    </li>
                    <li data-active={currentParam == "manga"}>
                        <Link href={`?format=manga`}>Mangas {bookmarksLength && (<span>({bookmarksLength.manga})</span>)}</Link>
                    </li>
                    <li data-active={currentParam == "movie"}>
                        <Link href={`?format=movie`}>Movies {bookmarksLength && (<span>({bookmarksLength.movie})</span>)}</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NavSideBar