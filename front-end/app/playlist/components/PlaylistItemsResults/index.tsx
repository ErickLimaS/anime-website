"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import { User, getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'
import CardMediaCoverAndDescription from '@/app/components/CardMediaCoverAndDescription'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'

function PlaylistItemsResults({ params }: { params?: { format: string } }) {

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const [userBookmarks, setUserBookmarks] = useState<BookmarkItem[] | null>()

    const router = useRouter()

    // GETS BOOKMARKS ON USER DOCUMENT
    async function getPlaylist() {

        const db = getFirestore(initFirebase());

        const bookmarks: BookmarkItem[] = await getDoc(doc(db, 'users', (user as User).uid)).then(doc => doc.get("bookmarks"))

        if (params?.format) {

            const filteredBookmarks = bookmarks.filter(item => item.format == params.format.toUpperCase())

            setUserBookmarks(filteredBookmarks)

            return
        }

        setUserBookmarks(bookmarks)

    }

    // IF USER IS NOT LOGGED IN, HE IS REDIRECTED TO LOGIN PAGE
    useEffect(() => {

        if (user?.uid) getPlaylist()

        if (!loading && (user?.uid == null || undefined)) {

            router.push("/login")

        }

    }, [loading, user, params?.format])

    return (
        userBookmarks && (
            <div id={styles.container}>

                <ul>

                    {userBookmarks.map((item, key: number) => (
                        <li key={key}>
                            <CardMediaCoverAndDescription data={item as ApiDefaultResult} />
                        </li>
                    ))}

                </ul>

            </div>
        )
    )
}

export default PlaylistItemsResults