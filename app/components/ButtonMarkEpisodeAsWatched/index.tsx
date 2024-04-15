"use client"
import React, { useEffect, useState } from 'react'
import CheckSvg from "@/public/assets/check-circle.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    DocumentData, DocumentSnapshot,
    FieldPath, arrayRemove,
    arrayUnion, doc,
    getDoc, getFirestore, setDoc
} from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import { SourceType } from '@/app/ts/interfaces/episodesSourceInterface'

type BtnTypes = {
    episodeId: string,
    episodeTitle: string,
    mediaId: number,
    source: SourceType["source"],
    hasText?: boolean
}

function ButtonMarkEpisodeAsWatched({ episodeId, episodeTitle, mediaId, source, hasText }: BtnTypes) {

    const [wasEpisodeWatched, setWasEpisodeWatched] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // CHECK IF EPISODE IS ON FIRESTORE, THEN CHANGE STATE
    async function checkEpisodeMarkedAsWatched() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return

        const isOnEpisodesList = userDoc.get("episodesWatchedBySource")?.[source]

        if (!isOnEpisodesList) return

        const episodedWatched = isOnEpisodesList[mediaId]?.find(
            (item: { episodeId: string }) => item.episodeId == episodeId
        )

        if (episodedWatched) setWasEpisodeWatched(true)

    }

    // ADD OR REMOVE EPISODE FROM FIRESTORE
    async function handleEpisodeWatch() {

        setIsLoading(true)

        if (!user) return

        const episodeData = {

            mediaId: mediaId,
            // crunchyroll has no ID for episodes, so it will be used its title
            episodeId: episodeId,
            episodeTitle: episodeTitle

        }

        await setDoc(doc(db, 'users', user.uid),
            {
                episodesWatchedBySource: {
                    [source]: {
                        [mediaId]: !wasEpisodeWatched ? arrayUnion(...[episodeData]) : arrayRemove(...[episodeData])
                    }
                }
            } as unknown as FieldPath,
            { merge: true }
        )

        if (!wasEpisodeWatched) setWasEpisodeWatched(true)
        else setWasEpisodeWatched(false)

        setIsLoading(false)
    }

    useEffect(() => {

        if (!user) return

        checkEpisodeMarkedAsWatched()

    }, [user, source, episodeId])

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