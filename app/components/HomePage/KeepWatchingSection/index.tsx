"use client"
import React, { useEffect, useState } from 'react'
import SwiperCarouselContainer from '../../SwiperCarouselContainer'
import styles from "./component.module.css"
import { AnimatePresence, motion } from 'framer-motion'
import { getAuth } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { initFirebase } from '@/app/firebaseApp'
import KeepWatchingEpisodeInfo from './components/KeepWatchingEpisodeInfo'
import { SwiperSlide } from 'swiper/react'

const framerMotionVariants = {
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

    useEffect(() => { if (user) getWatchingList() }, [user])

    async function getWatchingList() {

        const userDoc = await getDoc(doc(db, "users", user!.uid))

        const watchingList = userDoc.get("keepWatching")

        if (!watchingList) return setWatchingList([])

        const changeWatchingListFromObjectToArray: KeepWatchingItem[] = Object.keys(watchingList).map(key => {

            return watchingList[key]

        }).filter(item => item.length != 0 && item)

        const watchingListSortedByDate = changeWatchingListFromObjectToArray.sort(function (x, y) {
            return x.updatedAt - y.updatedAt
        }).reverse()

        setWatchingList(watchingListSortedByDate || [])

    }

    return (
        <AnimatePresence initial={false}>

            {(user && watchingList!.length > 0) && (
                <motion.section
                    id={styles.keep_watching_container}
                    variants={framerMotionVariants}
                    initial={"initial"}
                    animate={"animate"}
                >

                    <h2>Keep Watching</h2>

                    <div>

                        <SwiperCarouselContainer
                            options={{
                                slidesPerView: 2.2,
                                bp480: 2.2,
                                bp740: 3.2,
                                bp1275: 4.2
                            }}
                        >

                            {watchingList.map((media, key) => (

                                <SwiperSlide key={key} className="custom_swiper_list_item" role="listitem">

                                    <KeepWatchingEpisodeInfo
                                        animeInfo={media}
                                        darkMode
                                    />

                                </SwiperSlide>

                            ))}

                        </SwiperCarouselContainer>

                    </div>

                </motion.section>
            )}

        </AnimatePresence >
    )
}

export default KeepWatchingSection