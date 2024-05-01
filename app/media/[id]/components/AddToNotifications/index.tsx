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
    DocumentSnapshot, DocumentData,
    collection,
    deleteDoc,
    query,
    where,
    getDocs
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

    // WHEN BUTTON IS CLICKED, RUN FUNCTION TO ADD OR REMOVE USER FROM MEDIA'S NOTIFICATIONS USERS ASSIGNED
    async function addThisMedia() {

        // opens user login modal
        if (!user) return setIsUserModalOpen(true)

        setIsLoading(true)

        const mediaNotificationDoc = await getDoc(doc(db, "notifications", `${data.id}`))

        // compare last Update with additional 30 minutes with the current time. If TRUE, fetchs Notifications again
        function isCurrDateBiggerThanRelease(release: number) {

            const dateNow = Number((new Date().getTime() / 1000).toFixed(0))
            const releaseDate = release || 0

            return dateNow >= releaseDate

        }

        if (wasAddedToNotifications == false) {

            // if DOC doesnt exist
            if (mediaNotificationDoc.exists() == false) {

                const mediaNotificationInfo = {
                    mediaId: `${data.id}`,
                    lastUpdate: Number((new Date().getTime() / 1000).toFixed(0)),
                    coverImage: {
                        extraLarge: data.coverImage.extraLarge,
                        large: data.coverImage.large
                    },
                    nextReleaseDate: data.nextAiringEpisode?.airingAt || null,
                    status: data.status,
                    isComplete: data.status == "FINISHED",
                    episodes: [
                        {
                            releaseDate: data.nextAiringEpisode?.airingAt || null,
                            number: data.nextAiringEpisode?.episode,
                            wasReleased: isCurrDateBiggerThanRelease(data.nextAiringEpisode?.airingAt)
                        }
                    ]

                }

                await setDoc(doc(db, "notifications", `${data.id}`), mediaNotificationInfo)

                // adds user to list be notified
                await setDoc(doc(db, "notifications", `${data.id}`, "usersAssigned", user.uid), {
                    userRef: user.uid
                })

            }
            else { // if DOC exist

                const docData = mediaNotificationDoc.data()

                const updatedDocData = docData

                let episodesOnDoc = docData.episodes

                episodesOnDoc = episodesOnDoc.sort((a: { number: number }, b: { number: number }) => a.number - b.number)

                if (isCurrDateBiggerThanRelease(episodesOnDoc[episodesOnDoc.length - 1].releaseDate)) {

                    episodesOnDoc[episodesOnDoc.length - 1].wasReleased = isCurrDateBiggerThanRelease(episodesOnDoc[episodesOnDoc.length - 1].releaseDate)

                    if (data.status != "FINISHED") {

                        episodesOnDoc.push({
                            releaseDate: data.nextAiringEpisode?.airingAt || null,
                            number: data.nextAiringEpisode?.episode,
                            wasReleased: isCurrDateBiggerThanRelease(data.nextAiringEpisode?.airingAt)
                        })

                    }

                    episodesOnDoc.nextReleaseDate = data.nextAiringEpisode?.airingAt || null
                    episodesOnDoc.episodes = episodesOnDoc

                    await updateDoc(doc(db, 'notifications', `${data.id}`), updatedDocData)

                }

                // adds user to list be notified
                await setDoc(doc(db, "notifications", `${data.id}`, "usersAssigned", user.uid), {
                    userRef: user.uid
                })

            }

            // add Media Id to Notifications on User DOC
            await updateDoc(doc(db, 'users', user.uid),
                {
                    notifications: arrayUnion(...[
                        {
                            lastEpisodeNotified: data.nextAiringEpisode?.episode == 1 ? data.nextAiringEpisode?.episode : data.nextAiringEpisode?.episode - 1,
                            mediaId: data.id,
                            title: {
                                romaji: data.title.romaji,
                                native: data.title.native,
                            }
                        }])

                } as unknown as FieldPath,
                { merge: true }
            )

        }
        else {

            // remove user from list to be notified
            await deleteDoc(doc(db, 'notifications', `${data.id}`, "usersAssigned", user.uid))

            // add Media Id to Notifications on User DOC
            await updateDoc(doc(db, 'users', user.uid),
                {
                    notifications: arrayRemove(...[
                        {
                            lastEpisodeNotified: data.nextAiringEpisode?.episode == 1 ? data.nextAiringEpisode?.episode : data.nextAiringEpisode?.episode - 1,
                            mediaId: data.id,
                            title: {
                                romaji: data.title.romaji,
                                native: data.title.native,
                            }
                        }
                    ])

                } as unknown as FieldPath,
                { merge: true }
            )

        }

        setWasAddedToNotifications(!wasAddedToNotifications ? true : false)

        setIsLoading(false)
    }

    // IF MEDIA ID MATCHS ANY RESULT ON DB, IT SETS THIS COMPONENT BUTTON AS ACTIVE
    async function isMediaOnDB() {

        if (!user) return setWasAddedToNotifications(false)

        // check if theres a DOC for this MEDIA
        let mediaNotificationDoc: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(doc(db, 'notifications', `${data.id}`))

        // IF HAS DOC ON NOTIFICATIONS, IT CHECKS IF USER IS ASSIGNED TO RECEIVE NOTIFICATIONS
        if (mediaNotificationDoc.exists()) {

            setIsLoading(true)

            let userIsAssigned = query(collection(db, 'notifications', `${data.id}`, "usersAssigned"), where("userRef", "==", `${user.uid}`))

            const queryResult = await getDocs(userIsAssigned)

            // IF SIZE EQUALS 1, MEANS USER EXISTS, THEN HE IS ASSIGNED 
            queryResult.size == 1 ? setWasAddedToNotifications(true) : setWasAddedToNotifications(false)

            setIsLoading(false)

            return

        }

        setWasAddedToNotifications(false)

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