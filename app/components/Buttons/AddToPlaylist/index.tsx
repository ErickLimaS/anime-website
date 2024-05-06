"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import LoadingsssSvg from "@/public/assets/bookmark-check-fill.svg"
import {
    getFirestore, doc,
    updateDoc, arrayUnion,
    arrayRemove, getDoc,
    FieldPath
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp'
import { getAuth } from 'firebase/auth'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserModal from '@/app/components/UserLoginModal';
import { AnimatePresence, motion } from 'framer-motion';

function AddToPlaylistButton({ data, customText }: { data: ApiDefaultResult, customText?: any[] }) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wasAddedToPlaylist, setWasAddedToPlaylist] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
    async function addOrRemoveMediaOnDb() {

        if (!user) {

            // opens user login modal
            setIsUserModalOpen(true)

            return

        }

        setIsLoading(true)

        const bookmarkData = {
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
        }

        await updateDoc(doc(db, 'users', user.uid),
            {
                bookmarks: !wasAddedToPlaylist ? arrayUnion(...[bookmarkData]) : arrayRemove(...[bookmarkData])

            } as unknown as FieldPath,
            { merge: true }
        )

        !wasAddedToPlaylist ? setWasAddedToPlaylist(true) : setWasAddedToPlaylist(false)

        setIsLoading(false)

    }

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnDB() {

        if (!user) return

        const userDoc = await getDoc(doc(db, 'users', user.uid))

        const isMediaIdOnDoc = userDoc.get("bookmarks")?.find((item: { id: number }) => item.id == data.id)

        if (isMediaIdOnDoc) setWasAddedToPlaylist(true)

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
        <React.Fragment>
            {/* SHOWS USER LOGIN MODAL */}
            <AnimatePresence
                initial={false}
                mode='wait'
            >
                {isUserModalOpen && (
                    <UserModal
                        onClick={() => setIsUserModalOpen(false)}
                        auth={auth}
                    />
                )}
            </AnimatePresence>

            <motion.button
                whileTap={{ scale: 0.85 }}
                id={styles.container}
                className={customText ? styles.custom_text : ""}
                onClick={() => addOrRemoveMediaOnDb()}
                disabled={isLoading}
                data-added={wasAddedToPlaylist}
                aria-label={wasAddedToPlaylist ? "Click To Remove from Playlist" : "Click To Add To Playlist"}
                title={wasAddedToPlaylist ? `Remove ${data.title && data.title?.romaji} from Playlist` : `Add ${data.title && data.title?.romaji} To Playlist`}
            >
                {isLoading ?
                    <LoadingSvg alt="Loading Icon" width={16} height={16} />
                    :
                    (wasAddedToPlaylist ?
                        (customText ? customText[0] : (<><LoadingsssSvg width={16} height={16} /> ON PLAYLIST</>))
                        :
                        (customText ? customText[1] : "+ PLAYLIST"))
                }
            </motion.button>

        </React.Fragment>
    )
}

export default AddToPlaylistButton