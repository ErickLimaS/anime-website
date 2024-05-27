"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import Loading2Svg from "@/public/assets/bookmark-check-fill.svg"
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
import { motion } from 'framer-motion';
import ShowUpLoginPanelAnimated from '../../UserLoginModal/animatedVariant'

export function Button({ mediaInfo, children }: { mediaInfo: ApiDefaultResult, children?: React.ReactNode[] }) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wasAddedToPlaylist, setWasAddedToPlaylist] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    useEffect(() => {

        if (!user || loading) return

        setIsUserModalOpen(false)
        isMediaOnUserDoc()

    }, [user])

    // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE MEDIA FROM FIRESTORE
    async function handleMediaOnUserDoc() {

        // Opens Login Modal
        if (!user) return setIsUserModalOpen(true)

        setIsLoading(true)

        const bookmarkData = {
            id: mediaInfo.id,
            title: {
                romaji: mediaInfo.title.romaji
            },
            format: mediaInfo.format,
            description: mediaInfo.description,
            coverImage: {
                extraLarge: mediaInfo.coverImage.extraLarge,
                large: mediaInfo.coverImage.large
            }
        }

        await updateDoc(doc(db, 'users', user.uid),
            {
                bookmarks: !wasAddedToPlaylist ? arrayUnion(...[bookmarkData]) : arrayRemove(...[bookmarkData])

            } as unknown as FieldPath,
            { merge: true }
        )

        wasAddedToPlaylist ? setWasAddedToPlaylist(false) : setWasAddedToPlaylist(true)

        setIsLoading(false)

    }

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnUserDoc() {

        if (!user) return

        const userDoc = await getDoc(doc(db, 'users', user.uid))

        const wasMediaIdFoundOnDoc = userDoc.get("bookmarks")?.find((item: { id: number }) => item.id == mediaInfo.id)

        if (wasMediaIdFoundOnDoc) setWasAddedToPlaylist(true)

    }

    return (
        <React.Fragment>

            <ShowUpLoginPanelAnimated
                apperanceCondition={isUserModalOpen}
                customOnClickAction={() => setIsUserModalOpen(false)}
                auth={auth}
            />

            <motion.button
                whileTap={{ scale: 0.85 }}
                id={styles.container}
                className={children ? styles.custom_text : ""}
                onClick={() => handleMediaOnUserDoc()}
                disabled={isLoading}
                data-added={wasAddedToPlaylist}
                aria-label={wasAddedToPlaylist ? "Click To Remove from Playlist" : "Click To Add To Playlist"}
                title={wasAddedToPlaylist ? `Remove ${mediaInfo.title && mediaInfo.title?.romaji} from Playlist` : `Add ${mediaInfo.title && mediaInfo.title?.romaji} To Playlist`}
            >

                {isLoading ?
                    (<LoadingSvg alt="Loading Icon" width={16} height={16} />)
                    :
                    ((!isLoading && wasAddedToPlaylist) ?
                        (children ? children[1] : (<><Loading2Svg width={16} height={16} /> ON PLAYLIST</>))
                        :
                        (children ? children[0] : "+ PLAYLIST")
                    )
                }

            </motion.button>

        </React.Fragment>
    )
}

export function SvgIcon({ children }: { children: React.ReactNode }) {

    return (children)

}