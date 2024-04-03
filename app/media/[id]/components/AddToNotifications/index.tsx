"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import LoadingSvg from "@/public/assets/ripple-1s-200px.svg"
import BellFillSvg from "@/public/assets/bell-fill.svg"
import BellSvg from "@/public/assets/bell-slash.svg"
import {
    getFirestore, doc,
    updateDoc, arrayUnion,
    arrayRemove, getDoc,
    FieldPath, setDoc,
    DocumentSnapshot, DocumentData
} from 'firebase/firestore';
import { initFirebase } from '@/app/firebaseApp'
import { getAuth } from 'firebase/auth'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserModal from '@/app/components/UserLoginModal';
import { AnimatePresence, motion } from 'framer-motion';

function AddToNotificationsList({ data }: { data: ApiDefaultResult }) {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wasAddedToNotifications, setWasAddedToNotifications] = useState<boolean>(false)

    const [isUserModalOpen, setIsUserModalOpen] = useState(false)

    const auth = getAuth()

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

        const notificationData = {
            mediaId: data.id,
            title: {
                romaji: data.title.romaji
            },
            isComplete: data.status,
            nextReleaseDate: data.nextAiringEpisode?.airingAt,
            episodeNumber: data.nextAiringEpisode?.episode,
            lastEpisode: data.nextAiringEpisode?.episode == data.episodes,
            coverImage: {
                extraLarge: data.coverImage.extraLarge,
                large: data.coverImage.large
            }
        }

        await updateDoc(doc(db, 'users', user.uid),
            {
                notifications: !wasAddedToNotifications ? arrayUnion(...[notificationData]) : arrayRemove(...[notificationData])

            } as unknown as FieldPath,
            { merge: true }
        )

        !wasAddedToNotifications ? setWasAddedToNotifications(true) : setWasAddedToNotifications(false)

        setIsLoading(false)
    }

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnDB() {

        if (!user) return setWasAddedToNotifications(false)

        let userDoc: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(doc(db, 'users', user.uid))

        // IF USER HAS NO DOC ON FIRESTORE, IT CREATES ONE
        if (userDoc.exists() == false) {

            userDoc = await setDoc(doc(db, 'users', user.uid), {}) as unknown as DocumentSnapshot<DocumentData, DocumentData>

            return
        }

        const isMediaIdOnDoc = userDoc.get("notifications")?.find((item: NotificationFirebase) => item.mediaId == data.id)

        if (isMediaIdOnDoc) {
            setWasAddedToNotifications(true)
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

    if (data.nextAiringEpisode?.airingAt) {
        return (
            <>
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
                    onClick={() => addThisMedia()}
                    disabled={isLoading}
                    data-added={wasAddedToNotifications}
                    title={wasAddedToNotifications ?
                        `Remove ${data.title && data.title?.romaji} From Notifications`
                        :
                        `Get Notified When ${data.title && data.title?.romaji} Get a New Episode`
                    }
                >
                    {isLoading ?
                        <LoadingSvg alt="Loading Icon" width={16} height={16} />
                        :
                        (wasAddedToNotifications ?
                            <BellFillSvg width={16} height={16} />
                            :
                            <BellSvg width={16} height={16} />
                        )
                    }
                </motion.button>

            </>
        )
    }
}

export default AddToNotificationsList