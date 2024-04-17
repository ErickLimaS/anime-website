"use client"
import React, { useEffect, useState } from 'react'
import BellFillSvg from '@/public/assets/bell-fill.svg'
import BellSvg from '@/public/assets/bell.svg'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
    arrayRemove, arrayUnion,
    doc, FieldPath,
    getDoc, getFirestore,
    updateDoc
} from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { convertFromUnix } from '@/app/lib/formatDateUnix'
import anilist from '@/api/anilist'
import { ApiMediaResults } from '@/app/ts/interfaces/apiAnilistDataInterface'

function NotificationsComponent() {

    // HOW IT WORKS
    // 
    // [[[Currently, this is kinda messy, but a i have a ideia of how to optimize it and make it better later]]]. 
    // 
    // User stores the next episode on his document.
    // Then this component gets this field on user doc and filters to
    // show only when the current time is bigger than the episode release date. 
    // When release date is reached, it updates that media info for the next episode release date.
    // It checks every 30 min time span for any update on User Doc "notifications" 
    // 
    // Local storage helps keeping the control of when to update info, if notification panel was open or to check user doc again.

    const db = getFirestore(initFirebase())
    const auth = getAuth()
    const [user] = useAuthState(auth)

    const [notifications, setNotifications] = useState<NotificationFirebase[]>([])
    const [hasNewNotifications, setHasNewNotifications] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    // compare last Update with additional 30 minutes with the current time. If TRUE, fetchs Notifications again
    function isCurrDateBiggerThanLastUpdate() {

        const dateNow = Number((new Date().getTime() / 1000).toFixed(0))
        const dateLastUpdate = Number(Number(localStorage.getItem('notificationsLastUpdate')) + 1800) || 0

        return dateNow >= dateLastUpdate

    }

    // set notications from user doc on local storage
    async function updateNotificationsOnLocal() {

        const allNotificationsStored = await getDoc(doc(db, "users", user!.uid)).then(
            (res) => res.data()?.notifications || []
        )

        localStorage.setItem('notifications', JSON.stringify(allNotificationsStored))
        localStorage.setItem('notificationsLastUpdate', `${(new Date().getTime() / 1000).toFixed(0)}`)

    }

    // check if notifications already is setted on local storage
    async function checkNotificationsStored() {

        if (!user) return

        let notificationsStored: NotificationFirebase[] = []

        if (localStorage.getItem('notifications') == undefined) {

            notificationsStored = await getDoc(doc(db, "users", user!.uid)).then(
                (res) => res.data()?.notifications || []
            )

            localStorage.setItem('notificationsVisualized', "true")
            localStorage.setItem('notifications', JSON.stringify(notificationsStored))
            localStorage.setItem('notificationsLastUpdate', `${(new Date().getTime() / 1000).toFixed(0)}`)

        }
        else {

            // compare last Update with additional 30 minutes with the current time. If TRUE, fetchs Notifications again
            if (isCurrDateBiggerThanLastUpdate()) {

                notificationsStored = await getDoc(doc(db, "users", user!.uid)).then(
                    (res) => res.data()?.notifications || []
                ).then(
                    (res) => res.sort((a: NotificationFirebase, b: NotificationFirebase) => a.title.romaji.localeCompare(b.title.romaji))
                )

                localStorage.setItem('notificationsVisualized', "true")
                localStorage.setItem('notifications', JSON.stringify(notificationsStored))
                localStorage.setItem('notificationsLastUpdate', `${(new Date().getTime() / 1000).toFixed(0)}`)

            }

            if (notificationsStored.length == 0) notificationsStored = JSON.parse(localStorage.getItem('notifications')!) || []

        }

        showNotificationsByConditions(notificationsStored)

    }

    // check if notifications should be shown to the user, COMPARING the Curr Date with the Date of Release
    function showNotificationsByConditions(notificationsData: NotificationFirebase[]) {

        if (notificationsData.length == 0) return

        const currDateInUnix = parseInt((new Date().getTime() / 1000).toFixed(0))

        let notificationsToBeShown: NotificationFirebase[] = []

        notificationsData.map((item) => {
            (currDateInUnix >= item.nextReleaseDate && item.notificationVisualized == false)
                ? notificationsToBeShown.push(item) : undefined
        })

        if (notificationsToBeShown.length > 0) {
            localStorage.setItem('notificationsVisualized', "false")
            setHasNewNotifications(true)
        }

        setNotifications(notificationsToBeShown)

    }

    function openNotificationsMenu() {

        setMenuOpen(!menuOpen)

        localStorage.setItem('notificationsVisualized', "true")

        setHasNewNotifications(false)

        if (!menuOpen == false && notifications.length > 0) {

            const mediaNotificationsStillReleasing = notifications.filter(item => item.lastEpisode == false)
            const mediaFinishedNotifications = notifications.filter(item => item.lastEpisode == true)

            // if user is not assigned to any media notification, returns
            if (mediaNotificationsStillReleasing.length == 0 && mediaFinishedNotifications.length == 0) return

            // map notifications shown and updates info to next episode
            if (mediaFinishedNotifications.length > 0) {
                mediaNotificationsStillReleasing.map(async (item) => {

                    // gets the update media's updated info
                    const mediaData = await anilist.getMediaInfo(item.mediaId) as ApiMediaResults

                    const updateNotificationData = {
                        mediaId: mediaData.id,
                        title: {
                            romaji: mediaData.title.romaji
                        },
                        isComplete: mediaData.status,
                        notificationVisualized: mediaData.nextAiringEpisode?.episode ? false : true,
                        nextReleaseDate: mediaData.nextAiringEpisode?.airingAt,
                        episodeNumber: mediaData.nextAiringEpisode?.episode,
                        lastEpisode: mediaData.nextAiringEpisode?.episode == mediaData.episodes,
                        coverImage: {
                            extraLarge: mediaData.coverImage.extraLarge,
                            large: mediaData.coverImage.large
                        }
                    }

                    // removes older notication with previous data
                    await updateDoc(doc(db, 'users', user!.uid),
                        {
                            notifications: arrayRemove(...[item])

                        } as unknown as FieldPath,
                        { merge: true }
                    ).catch(
                        err => { return console.log(err) }
                    )

                    // add new data to notificaion media
                    await updateDoc(doc(db, 'users', user!.uid),
                        {
                            notifications: arrayUnion(...[updateNotificationData])

                        } as unknown as FieldPath,
                        { merge: true }
                    ).catch(
                        err => { return console.log(err) }
                    )

                })
            }

            // if theres medias that just FINISHED, it will set then to "notificationVisualized" true
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

                    // add field VISUALIZED to updated item
                    item.notificationVisualized = true

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

            updateNotificationsOnLocal()

        }

    }

    useEffect(() => {

        if (localStorage.getItem('notificationsVisualized')) {
            if (localStorage.getItem('notificationsVisualized') == "true") setHasNewNotifications(false)
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
                        onClick={() => openNotificationsMenu()}
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

                                                        <h5>Episode {item.episodeNumber} Released!</h5>

                                                        <small>{item.title.romaji}</small>

                                                        {item.lastEpisode && (
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