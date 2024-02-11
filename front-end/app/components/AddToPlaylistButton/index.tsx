"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, FieldPath } from 'firebase/firestore';
import { initFirebase } from "@/firebase/firebaseApp"
import { getAuth } from 'firebase/auth'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation';

function AddToPlaylistButton({ data, customText }: { data: ApiDefaultResult, customText?: any[] }) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wasAddedToPlaylist, setWasAddedToPlaylist] = useState<boolean>(false)

    const auth = getAuth()
    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const router = useRouter()

    // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
    async function addThisMedia() {

        if (!user) {
            router.push("/login")
            return
        }

        setIsLoading(true)

        if (!wasAddedToPlaylist) {

            await updateDoc(doc(db, 'users', user.uid),
                {
                    bookmarks: arrayUnion({
                        id: data.id,
                        title: {
                            romaji: data.title.romaji
                        },
                        coverImage: {
                            extraLarge: data.coverImage.extraLarge,
                            large: data.coverImage.large
                        }
                    })
                } as unknown as FieldPath,
                { merge: true }
            )

            setWasAddedToPlaylist(true)

        }
        else {

            await updateDoc(doc(db, 'users', user.uid),
                {
                    bookmarks: arrayRemove({
                        id: data.id,
                        title: {
                            romaji: data.title.romaji
                        },
                        coverImage: {
                            extraLarge: data.coverImage.extraLarge,
                            large: data.coverImage.large
                        }
                    })
                } as unknown as FieldPath,
                { merge: true }
            )

            setWasAddedToPlaylist(false)

        }

        setIsLoading(false)
    }

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnDB() {

        if (!user) return setWasAddedToPlaylist(false)

        await getDoc(doc(db, 'users', user.uid)).then((doc) => {

            const isMediaIdOnDoc = doc.get("bookmarks").find((item: { id: number }) => item.id == data.id)

            if (isMediaIdOnDoc) {
                setWasAddedToPlaylist(true)
            }

        })

    }

    useEffect(() => {

        if (!user || loading) return

        isMediaOnDB()

    }, [user])

    return (
        <button
            id={styles.container}
            onClick={() => addThisMedia()}
            disabled={isLoading}
            data-added={wasAddedToPlaylist}
            aria-label={wasAddedToPlaylist ? "Click To Remove from Playlist" : "Click To Add To Playlist"}
        >
            {isLoading ?
                <LoadingSvg alt="Loading Icon" width={16} height={16} />
                :
                (wasAddedToPlaylist ? (customText ? customText[0] : "ON PLAYLIST") : (customText ? customText[1] : "+ PLAYLIST"))
            }
        </button>
    )
}

export default AddToPlaylistButton