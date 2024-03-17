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
    const [keepWatchingLength, setKeepWatchingLength] = useState<{ all: number, anime: number, manga: number, movie: number }>()

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    async function fetchData() {

        let keepWatchingList = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("keepWatching"))

        let listFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = listFromObjectToArray.filter(item => item.length != 0 && item)

        setKeepWatchingLength(
            {
                all: keepWatchingList.length,
                anime: keepWatchingList.filter((item: KeepWatchingItem) => item.format == "TV").length,
                manga: keepWatchingList.filter((item: KeepWatchingItem) => item.format == "MANGA").length,
                movie: keepWatchingList.filter((item: KeepWatchingItem) => item.format == "MOVIE").length
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
                        <Link href={`/history`}>All {keepWatchingLength && (<span>({keepWatchingLength.all})</span>)}</Link>
                    </li>
                    <li data-active={currentParam == "tv"}>
                        <Link href={`?format=tv`}>Animes {keepWatchingLength && (<span>({keepWatchingLength.anime})</span>)}</Link>
                    </li>
                    <li data-active={currentParam == "manga"}>
                        <Link href={`?format=manga`}>Mangas {keepWatchingLength && (<span>({keepWatchingLength.manga})</span>)}</Link>
                    </li>
                    <li data-active={currentParam == "movie"}>
                        <Link href={`?format=movie`}>Movies {keepWatchingLength && (<span>({keepWatchingLength.movie})</span>)}</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NavSideBar