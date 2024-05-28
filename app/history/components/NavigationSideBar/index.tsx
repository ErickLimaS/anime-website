"use client"
import Link from 'next/link'
import React, { useLayoutEffect, useState } from 'react'
import styles from "./component.module.css"
import { User, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'

function NavigationSideBar({ params }: { params?: { format: string } }) {

    const [currParams, setCurrParams] = useState("")
    const [keepWatchingTypesQuantity, setKeepWatchingTypesQuantity] = useState<{ all: number, anime: number, manga: number, movie: number }>()

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    useLayoutEffect(() => {

        if (!loading && user) getKeepWatchingList()

        setCurrParams(params?.format || "")

    }, [loading, params])

    async function getKeepWatchingList() {

        let keepWatchingList = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("keepWatching"))

        let keepWatchingListFromObjectToArray = Object.keys(keepWatchingList).map(key => {

            return keepWatchingList[key]

        })

        keepWatchingList = keepWatchingListFromObjectToArray.filter(item => item.length != 0 && item)

        setKeepWatchingTypesQuantity(
            {
                all: keepWatchingList.length,
                anime: keepWatchingList.filter((item: KeepWatchingItem) => item.format == "TV").length,
                manga: keepWatchingList.filter((item: KeepWatchingItem) => item.format == "MANGA").length,
                movie: keepWatchingList.filter((item: KeepWatchingItem) => item.format == "MOVIE").length
            }
        )

    }

    return (
        <React.Fragment>
            <p>FORMAT</p>

            <nav id={styles.nav_container}>
                <ul>
                    <li data-active={currParams == ""}>
                        <Link href={`/history`}>
                            All {keepWatchingTypesQuantity && (<span>({keepWatchingTypesQuantity.all})</span>)}
                        </Link>
                    </li>
                    <li data-active={currParams == "tv"}>
                        <Link href={`?format=tv`}>
                            Animes {keepWatchingTypesQuantity && (<span>({keepWatchingTypesQuantity.anime})</span>)}
                        </Link>
                    </li>
                    <li data-active={currParams == "manga"}>
                        <Link href={`?format=manga`}>
                            Mangas {keepWatchingTypesQuantity && (<span>({keepWatchingTypesQuantity.manga})</span>)}
                        </Link>
                    </li>
                    <li data-active={currParams == "movie"}>
                        <Link href={`?format=movie`}>
                            Movies {keepWatchingTypesQuantity && (<span>({keepWatchingTypesQuantity.movie})</span>)}
                        </Link>
                    </li>
                </ul>
            </nav>
        </React.Fragment>
    )
}

export default NavigationSideBar