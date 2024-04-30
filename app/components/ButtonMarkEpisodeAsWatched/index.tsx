"use client"
import React, { useEffect, useState } from 'react'
import CheckSvg from "@/public/assets/check-circle.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    FieldPath, arrayRemove,
    arrayUnion, doc, getFirestore, setDoc
} from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface'

type BtnTypes = {
    episodeNumber: number,
    episodeTitle: string,
    mediaId: number,
    hasText?: boolean,
    wasWatched?: boolean
}

function ButtonMarkEpisodeAsWatched({ episodeNumber, episodeTitle, mediaId, wasWatched, hasText }: BtnTypes) {

    const [wasEpisodeWatched, setWasEpisodeWatched] = useState<boolean>(wasWatched || false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    // ADD OR REMOVE EPISODE FROM FIRESTORE
    async function handleEpisodeWatch() {

        setIsLoading(true)

        if (!user) return

        const episodeData = {

            mediaId: mediaId,
            episodeNumber: episodeNumber,
            episodeTitle: episodeTitle

        }

        await setDoc(doc(db, 'users', user.uid),
            {
                episodesWatched: {
                    [mediaId]: wasEpisodeWatched ? arrayRemove(...[episodeData]) : arrayUnion(...[episodeData])
                }

            } as unknown as FieldPath,
            { merge: true }
        ).then(() =>
            setWasEpisodeWatched(!wasEpisodeWatched)
        )

        setIsLoading(false)

    }

    useEffect(() => {
        setWasEpisodeWatched(wasWatched || false)
    }, [wasWatched])

    return (

        user && (
            <div className={styles.button_container}>

                <motion.button
                    onClick={() => handleEpisodeWatch()}
                    data-active={wasEpisodeWatched}
                    disabled={isLoading}
                    title={wasEpisodeWatched ? "Mark as Unwatched " : "Mark as Watched"}
                >
                    {wasEpisodeWatched ? (
                        <CheckFillSvg width={16} height={16} alt="Check Episode as Watched" />
                    ) : (
                        <CheckSvg width={16} height={16} alt="Check Episode as Not Watched" />
                    )}

                </motion.button>

                <AnimatePresence>
                    {(hasText && wasEpisodeWatched) && (
                        <motion.span
                            className={styles.text_span}
                            initial={{ opacity: 0, y: "10px" }}
                            animate={{ opacity: 1, y: "0", transition: { duration: 0.2 } }}
                            exit={{ opacity: 0, y: "10px" }}
                        >
                            Watched
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>
        )

    )
}

export default ButtonMarkEpisodeAsWatched