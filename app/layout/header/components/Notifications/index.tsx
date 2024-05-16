"use client"
import React, { useEffect, useState } from 'react'
import BellFillSvg from '@/public/assets/bell-fill.svg'
import BellSvg from '@/public/assets/bell.svg'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    arrayRemove, arrayUnion,
    collection,
    doc, DocumentData, FieldPath,
    getDoc, getDocs, getFirestore,
    query,
    updateDoc,
    where
} from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { convertFromUnix, getCurrentUnixDate } from '@/app/lib/formatDateUnix'
import anilist from '@/app/api/anilist'
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'

function NotificationsComponent() {

    // HOW IT WORKS
    // 
    // This component is related to a Collection called "Notifications" on Firebase. This collection stores
    // the episodes for each media and has the number and release date on it.
    // The logic here is that, the user is assigned to these Medias on Notifications Collection, and in this
    // component, it checks the latest date the User Doc with these info awas updated. If the date is older than 
    // the latests episodes released, it shows on Header Notification Modal.
    // 
    // Was make this way because any time a user is assigned to this same media, that user updates the medias info available
    // for all the user. Previously, it was meant that each user had its own notification field on his doc. 

    const db = getFirestore(initFirebase())
    const auth = getAuth()
    const [user] = useAuthState(auth)

    const [notifications, setNotifications] = useState<NotificationsCollectionFirebase[]>([])
    const [hasNewNotifications, setHasNewNotifications] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    // Compares LocalStorage Last Update with additional 10 minutes with the current time.
    // If TRUE, fetchs Notifications again
    function isCurrDateBiggerThanLastUpdate() {

        const dateNow = getCurrentUnixDate()
        const dateLastUpdate = Number(Number(localStorage.getItem('notificationsLastUpdate')) + 600) || 0

        return dateNow >= dateLastUpdate

    }

    // check if notifications already is setted on local storage
    async function checkNotificationsStored() {

        if (!user) return

        if (localStorage.getItem('notifications') == undefined) {
            setNotificationsOnLocalStorage()
        }
        else {
            updateNotificationsOnLocalStorage()
        }

    }

    // Set notifications to be shown to the user
    function showNotificationsByConditions(notificationsData: NotificationsCollectionFirebase[]) {

        if (notificationsData.length == 0) return

        localStorage.setItem('notificationsVisualized', "false")
        setHasNewNotifications(true)

        setNotifications(notificationsData)

    }

    async function setNotificationsOnLocalStorage() {

        let userAssignedNotifications: any[] = []

        // gets all notification's that user is assigned
        await getDoc(doc(db, "users", user!.uid)).then((res) => {
            userAssignedNotifications = res.data()?.notifications || []
        })

        if (userAssignedNotifications.length > 0) {

            // stores notifications Medias Id
            let mediasIdsArray = []
            mediasIdsArray.push(userAssignedNotifications.map(item => `${item.mediaId}`))

            mediasIdsArray = mediasIdsArray[0]

            const notificationsCollectionDocs = await getDocs(query(collection(db, 'notifications'), where(
                "mediaId", "in", mediasIdsArray)
            )).then((res) => res.docs.map(item => item.data())) as NotificationsCollectionFirebase[]


            if (notificationsCollectionDocs) {

                // sort episodes number
                notificationsCollectionDocs.map((item) => item.episodes = item.episodes.sort((a, b) => a.number - b.number))

                notificationsCollectionDocs.map((item) => item.episodes = [item.episodes[item.episodes.length - 1]])

            }

            userAssignedNotifications = notificationsCollectionDocs

        }

        localStorage.setItem('notificationsVisualized', "true")
        localStorage.setItem('notifications', JSON.stringify(userAssignedNotifications))
        localStorage.setItem('notificationsLastUpdate', `${(new Date().getTime() / 1000).toFixed(0)}`)

        showNotificationsByConditions(userAssignedNotifications)

    }

    async function updateNotificationsOnLocalStorage() {

        let userAssignedNotifications: any[] = []

        if (isCurrDateBiggerThanLastUpdate()) {

            await getDoc(doc(db, "users", user!.uid)).then((res) => {
                userAssignedNotifications = res.data()?.notifications || []
            })

            let mediasIdsArray = []
            mediasIdsArray.push(userAssignedNotifications.map(item => `${item.mediaId}`))

            mediasIdsArray = mediasIdsArray[0]

            const notificationsCollectionDocs = await getDocs(query(collection(db, 'notifications'), where(
                "mediaId", "in", mediasIdsArray)
            )).then((res) =>
                res.docs.map(item => item.data())
            ) as NotificationsCollectionFirebase[]

            // compares episodes on local and doc and check if theres a new one
            if (notificationsCollectionDocs) {

                notificationsCollectionDocs.map((item) => item.episodes = item.episodes.sort((a: any, b: any) => a.number - b.number))

                let showNotificationsList = []

                for (let i = 0; userAssignedNotifications.length >= i + 1; i++) {

                    // gets the current media on LOOP
                    const onDbNotificationsMatches = notificationsCollectionDocs.find((item) => `${item.mediaId}` == `${userAssignedNotifications[i].mediaId}`)

                    if (onDbNotificationsMatches) {

                        if (!onDbNotificationsMatches.title) onDbNotificationsMatches.title = userAssignedNotifications[i].title

                        // if curr date is bigger than last episode released date
                        const lastEpisodeNotificationVisualizedOnDB = onDbNotificationsMatches.episodes[onDbNotificationsMatches.episodes.length - 1]
                        const lastEpisodeNotificationVisualizedOnLocal = userAssignedNotifications[i]

                        // if latest Episode Released on DB is bigger than last episode notified 
                        if (lastEpisodeNotificationVisualizedOnDB.number > lastEpisodeNotificationVisualizedOnLocal.lastEpisodeNotified) {

                            if (Number((new Date().getTime() / 1000).toFixed(0)) > lastEpisodeNotificationVisualizedOnDB.releaseDate!) {

                                showNotificationsList.push(onDbNotificationsMatches)

                            }

                        }

                    }

                }

                userAssignedNotifications = notificationsCollectionDocs

                if (showNotificationsList.length > 0) {
                    showNotificationsByConditions(showNotificationsList)
                }

                localStorage.setItem('notificationsVisualized', "true")
                localStorage.setItem('notifications', JSON.stringify(notificationsCollectionDocs))
                localStorage.setItem('notificationsLastUpdate', `${(new Date().getTime() / 1000).toFixed(0)}`)

            }
        }

        if (userAssignedNotifications.length == 0) {
            userAssignedNotifications = JSON.parse(localStorage.getItem('notifications')!) || []
        }

    }

    function toggleOpenNotificationsMenu() {

        setMenuOpen(!menuOpen)

        localStorage.setItem('notificationsVisualized', "true")

        setHasNewNotifications(false)

        if (notifications.length > 0) {

            const mediaNotificationsStillReleasing: NotificationsCollectionFirebase[] = notifications.filter(item => item.isComplete == false)
            const mediaFinishedNotifications: NotificationsCollectionFirebase[] = notifications.filter(item => item.isComplete == true)

            // MAP notifications shown and updates info to next episode
            if (mediaNotificationsStillReleasing.length > 0) {

                mediaNotificationsStillReleasing.map(async (item) => {

                    // gets the media's latest info
                    const mediaData = await anilist.getMediaInfo(Number(item.mediaId)) as ApiMediaResults

                    // 
                    await updateMediaOnNotificationCollection(mediaData)

                    // removes older notication with previous data
                    await updateDoc(doc(db, 'users', user!.uid),
                        {
                            notifications: arrayRemove(...[
                                {
                                    // if theres no new episode to release, set total episodes number as last notified
                                    lastEpisodeNotified: mediaData.nextAiringEpisode ? mediaData.nextAiringEpisode.episode - 2 : mediaData.episodes,
                                    mediaId: mediaData.id,
                                    title: {
                                        romaji: mediaData.title.romaji,
                                        native: mediaData.title.native,
                                    }
                                }])

                        } as unknown as FieldPath,
                        { merge: true }
                    ).catch(
                        err => { return console.log(err) }
                    )

                    // add new data to notificaion media
                    await updateDoc(doc(db, 'users', user!.uid),
                        {
                            notifications: arrayUnion(...[
                                {
                                    lastEpisodeNotified: mediaData.nextAiringEpisode ? mediaData.nextAiringEpisode?.episode - 1 : mediaData.episodes,
                                    mediaId: mediaData.id,
                                    title: {
                                        romaji: mediaData.title.romaji,
                                        native: mediaData.title.native,
                                    }
                                }])

                        } as unknown as FieldPath,
                        { merge: true }
                    ).catch(
                        err => { return console.log(err) }
                    )

                })
            }

            // MAP medias that just FINISHED
            if (mediaFinishedNotifications.length > 0) {

                mediaFinishedNotifications.map(async (item) => {

                    // removes older notication with previous data
                    await updateDoc(doc(db, 'users', user!.uid),
                        {
                            notifications: arrayRemove(...[item])

                        } as unknown as FieldPath,
                        { merge: true }
                    ).catch(
                        err => { return console.log(err) }
                    )

                    // add new data to notification media
                    await updateDoc(doc(db, 'users', user!.uid),
                        {
                            notifications: arrayUnion(...[item])

                        } as unknown as FieldPath,
                        { merge: true }
                    ).catch(
                        err => { return console.log(err) }
                    )

                })

            }

            // UPDATES Notifications Collection with new Episodes Releases and Status
            async function updateMediaOnNotificationCollection(mediaData: ApiMediaResults) {

                const mediaNotificationDoc = await getDoc(doc(db, "notifications", `${mediaData.id}`)).then(
                    (res) => res.data()
                ) as NotificationsCollectionFirebase | DocumentData

                mediaNotificationDoc.nextReleaseDate = mediaData.nextAiringEpisode?.airingAt
                mediaNotificationDoc.status = mediaData.status
                mediaNotificationDoc.lastUpdate = Number((new Date().getTime() / 1000).toFixed(0))
                mediaNotificationDoc.isComplete = mediaData.status == "COMPLETE" ? true : false

                if (mediaData.status != "FINISHED") {

                    (mediaNotificationDoc as NotificationsCollectionFirebase).episodes.map(
                        (item) => item.wasReleased = Number((new Date().getTime() / 1000).toFixed(0)) > (item.releaseDate ? item.releaseDate : 0)
                    )

                    mediaNotificationDoc.episodes.push({
                        releaseDate: mediaData.nextAiringEpisode?.airingAt || null,
                        number: mediaData.nextAiringEpisode?.episode,
                        wasReleased: Number((new Date().getTime() / 1000).toFixed(0)) > mediaData.nextAiringEpisode?.airingAt
                    })

                }

                await updateDoc(doc(db, 'notifications', `${mediaData.id}`), mediaNotificationDoc)

            }

            async function updateNotificationsOnLocal() {

                const allNotificationsStored = await getDoc(doc(db, "users", user!.uid)).then(
                    (res) => res.data()?.notifications || []
                )

                localStorage.setItem('notifications', JSON.stringify(allNotificationsStored))
                localStorage.setItem('notificationsLastUpdate', `${(new Date().getTime() / 1000).toFixed(0)}`)

            }

            updateNotificationsOnLocal()

        }

    }

    useEffect(() => {

        if (localStorage.getItem('notificationsVisualized') && localStorage.getItem('notificationsVisualized') == "true") {
            setHasNewNotifications(false)
        }
        else {
            localStorage.setItem('notificationsVisualized', "true")
        }

        checkNotificationsStored()

    }, [user])

    if (user) {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    id={styles.notification_container}
                >
                    <button
                        id={styles.notification_btn}
                        onClick={() => toggleOpenNotificationsMenu()}
                        title={menuOpen ? "Close Notifications" : "Open Notifications"}
                        data-active={menuOpen}
                    >
                        {hasNewNotifications ? (
                            <BellFillSvg fill="white" width={16} height={16} />
                        ) : (
                            <BellSvg fill="white" width={16} height={16} />
                        )}
                    </button>

                    {hasNewNotifications && (
                        <span id={styles.notifications_badge}>{notifications.length}</span>
                    )}

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ y: "-20px", opacity: 0 }}
                                animate={{ y: "0px", opacity: 1 }}
                                exit={{ y: "-20px", opacity: 0 }}
                                id={styles.results_container}
                            >

                                <h4>Latest Notifications</h4>

                                {notifications.length == 0 ?
                                    (
                                        <div>
                                            <p style={{ color: "var(--white-100)" }}>No New Notifications</p>
                                        </div>
                                    ) : (
                                        <ul>
                                            {notifications.map((item, key) => (

                                                <li
                                                    key={key}
                                                    className={styles.notification_item_container}
                                                    aria-label={`${item.title.romaji} new episode released`}
                                                >

                                                    <div className={styles.img_container}>
                                                        <Image
                                                            src={item.coverImage.large}
                                                            alt={item.title.romaji}
                                                            fill
                                                            sizes='100px'
                                                        />
                                                    </div>

                                                    <div className={styles.notification_item_info}>

                                                        <h5>Episode {item.episodes[item.episodes.length - 1]?.number} Released!</h5>

                                                        <small>{item.title.romaji}</small>

                                                        {item.status != "RELEASING" && (
                                                            <p><b>Watch the Season Finale!</b></p>
                                                        )}

                                                        <p>Released on {convertFromUnix(item.nextReleaseDate)}</p>

                                                        <Link href={`/media/${item.mediaId}`}>SEE MORE</Link>

                                                    </div>

                                                </li>

                                            ))}
                                        </ul>
                                    )
                                }
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div >
            </AnimatePresence>
        )
    }
}

export default NotificationsComponent