"use client"
import { EpisodesType } from '@/app/ts/interfaces/apiAnilistDataInterface'
import React, { useEffect, useState } from 'react'
import CheckSvg from "@/public/assets/check-circle.svg"
import CheckFillSvg from "@/public/assets/check-circle-fill.svg"
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { DocumentData, DocumentSnapshot, FieldPath, arrayRemove, arrayUnion, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'
import { MediaEpisodes } from '@/app/ts/interfaces/apiGogoanimeDataInterface'
import styles from "./component.module.css"

function ButtonMarkEpisodeAsWatched({ data, mediaId, source, hasText }: { data: EpisodesType | MediaEpisodes, mediaId: number, source: string, hasText?: boolean }) {

    const [wasEpisodeWatched, setWasEpisodeWatched] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const auth = getAuth()

    const [user, loading] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    // CHECK IF EPISODE IS ON FIRESTORE, THEN CHANGE STATE
    async function checkEpisodeMarkedAsWatched() {

        const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(db, 'users', user!.uid))

        if (!userDoc) return

        const isOnEpisodesList = userDoc.get("episodesWatchedBySource")?.[source]

        if (!isOnEpisodesList) return

        const episodedWatched = isOnEpisodesList[mediaId]?.find(
            (item: { episodeId: string }) => item.episodeId == (source == "crunchyroll" ? (data as EpisodesType).title : (data as MediaEpisodes).id)
        )

        if (episodedWatched) setWasEpisodeWatched(true)

    }

    // ADD OR REMOVE EPISODE FROM FIRESTORE
    async function handleEpisodeWatch() {

        setIsLoading(true)

        if (!user) return

        const episodeData = {

            mediaId: mediaId,
            // crunchyroll has no id for episodes, so it will be used its title
            episodeId: source == "crunchyroll" ? (data as EpisodesType).title : (data as MediaEpisodes).id,
            episodeTitle: source == "crunchyroll" ? (data as EpisodesType).title : (data as MediaEpisodes).number

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

    }, [user, source])

    return (

        user && (
            <div className={styles.button_container}>

                <button
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

                </button>

                {hasText && (
                    <span data-active={wasEpisodeWatched}>Watched</span>
                )}

            </div>
        )

    )
}

export default ButtonMarkEpisodeAsWatched