"use client"
import React, { useEffect, useState } from 'react'
import BellFillSvg from '@/public/assets/bell-fill.svg'
import BellSvg from '@/public/assets/bell.svg'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { convertFromUnix } from '@/app/lib/formatDateUnix'

function NotificationsComponent() {

    const db = getFirestore(initFirebase())
    const auth = getAuth()
    const [user] = useAuthState(auth)

    const [notifications, setNotifications] = useState<NotificationFirebase[]>([])
    const [hasNewNotifications, setHasNewNotifications] = useState<boolean>(false)
    const [menuOpen, setMenuOpen] = useState<boolean>(false)

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

            const dateNow = Number((new Date().getTime() / 1000).toFixed(0))
            const dateLastUpdate = Number(Number(localStorage.getItem('notificationsLastUpdate')) + 1800) || 0

            // compare last Update with additional 30 minutes with the current time. If TRUE, fetchs Notifications again
            if (dateNow >= dateLastUpdate) {

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
            currDateInUnix >= item.nextReleaseDate ? notificationsToBeShown.push(item) : undefined
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