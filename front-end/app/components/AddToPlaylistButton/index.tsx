"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, FieldPath, setDoc, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { initFirebase } from "@/firebase/firebaseApp"
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserModal from '@/app/components/UserLoginModal';
import { AnimatePresence } from 'framer-motion';

function AddToPlaylistButton({ data, customText }: { data: ApiDefaultResult, customText?: any[] }) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wasAddedToPlaylist, setWasAddedToPlaylist] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const auth = getAuth()
    const provider = new GoogleAuthProvider()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
    async function addThisMedia() {

        if (!user) {

            // opens user login modal
            setIsUserModalOpen(true)
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
                        format: data.format,
                        description: data.description,
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
                        format: data.format,
                        description: data.description,
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

        let userDoc: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(doc(db, 'users', user.uid))

        // IF USER HAS NO DOC ON FIRESTORE, IT CREATES ONE
        if (userDoc.exists() == false) {

            userDoc = await setDoc(doc(db, 'users', user.uid), {}) as unknown as DocumentSnapshot<DocumentData, DocumentData>

            return
        }

        const isMediaIdOnDoc = userDoc.get("bookmarks").find((item: { id: number }) => item.id == data.id)

        if (isMediaIdOnDoc) {
            setWasAddedToPlaylist(true)
        }
    }

    useEffect(() => {

        if (!user || loading) {
            return
        } else {
            setIsUserModalOpen(false)
            isMediaOnDB()
        }


    }, [user])

    return (
        <>
            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {isUserModalOpen && (
                    <UserModal onClick={() => setIsUserModalOpen(false)} auth={auth} provider={provider} />
                )}
            </AnimatePresence>

            <button
                id={styles.container}
                onClick={() => addThisMedia()}
                disabled={isLoading}
                data-added={wasAddedToPlaylist}
                aria-label={wasAddedToPlaylist ? "Click To Remove from Playlist" : "Click To Add To Playlist"}
                title={wasAddedToPlaylist ? `Remove ${data.title && data.title?.romaji} from Playlist` : `Add ${data.title && data.title?.romaji} To Playlist`}
            >
                {isLoading ?
                    <LoadingSvg alt="Loading Icon" width={16} height={16} />
                    :
                    (wasAddedToPlaylist ? (customText ? customText[0] : "ON PLAYLIST") : (customText ? customText[1] : "+ PLAYLIST"))
                }
            </button>

        </>
    )
}

export default AddToPlaylistButton