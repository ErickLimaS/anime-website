"use client"
import React, { useEffect, useState } from 'react'
import SwiperContainer from '../../SwiperContainer'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import KeepWatchingEpisodeInfo from './components/KeepWatchingEpisodeInfo'
import { SwiperSlide } from 'swiper/react'

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

function KeepWatchingSection() {

    const auth = getAuth()

    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase());

    const [watchingList, setWatchingList] = useState<KeepWatchingItem[]>([])

    async function getWatchingList() {

        const userDoc = await getDoc(doc(db, "users", user!.uid))

        const watchingList = userDoc.get("keepWatching")

        let listFromObjectToArray = Object.keys(watchingList).map(key => {

            return watchingList[key]

        })

        // removes any empty object
        listFromObjectToArray = listFromObjectToArray.filter(item => item.length != 0 && item)

        // sort by update date
        listFromObjectToArray = listFromObjectToArray.sort(function (x: KeepWatchingItem, y: KeepWatchingItem) {
            return x.updatedAt - y.updatedAt
        }).reverse()

        setWatchingList(listFromObjectToArray || null)

    }

    useEffect(() => {

        if (user) getWatchingList()

    }, [user])

    return (
        <AnimatePresence
            initial={false}
        >
            {(user && watchingList!.length > 0) && (
                <motion.section
                    id={styles.keep_watching_container}
                    variants={motionVariants}
                    initial={"initial"}
                    animate={"animate"}
                >

                    <h2>Keep Watching</h2>

                    <div>

                        <SwiperContainer
                            options={{
                                slidesPerView: 2.2,
                                bp480: 2.2,
                                bp740: 3.2,
                                bp1275: 4.2
                            }}
                        >

                            {watchingList.map((item, key) => (

                                <SwiperSlide key={key} className="custom_swiper_list_item" role="listitem">

                                    <KeepWatchingEpisodeInfo darkMode={true} data={item as KeepWatchingItem} />

                                </SwiperSlide>

                            ))}

                        </SwiperContainer>

                    </div>

                </motion.section>
            )
            }
        </AnimatePresence >
    )
}

export default KeepWatchingSection