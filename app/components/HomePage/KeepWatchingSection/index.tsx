"use client"
import React, { useEffect, useState } from 'react'
import SwiperListContainer from '../../SwiperListContainer'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/firebase/firebaseApp'

function KeepWatchingSection() {

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const [watchingList, setWatchingList] = useState<any | null>(null)

    const motionVariants = {
        initial: {
            opacity: 0,
            height: 0
        },
        animate: {
            opacity: 1,
            height: "auto",
            transition: {
                staggerChildren: 0.1,
            },
        }
    }

    async function getWatchingList() {

        const userDoc = await getDoc(doc(db, "users", user!.uid))

        const watchingList = userDoc.get("keepWatching")

        let listFromObjectToArray = Object.keys(watchingList).map(key => {

            return watchingList[key]

        })

        listFromObjectToArray = listFromObjectToArray.filter(item => item.length != 0 && item)

        setWatchingList(listFromObjectToArray || null)

    }

    useEffect(() => {

        if (user) getWatchingList()

    }, [user])

    return (
        <AnimatePresence
            initial={false}
        >
            {(user && watchingList) && (
                <motion.section
                    id={styles.keep_watching_container}
                    variants={motionVariants}
                    initial={"initial"}
                    animate={"animate"}
                >

                    <h2>Keep Watching</h2>

                    <div>

                        <SwiperListContainer
                            keepWatchingVariant={true}
                            data={watchingList}
                        />

                    </div>

                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default KeepWatchingSection