"use client"
import React, { useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo2 from '../../MediaItemCoverInfo2'
import NavButtons from '../../NavButtons'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from "@/api/anilist"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/app/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import simulateRange from '@/app/lib/simulateRange'

type PropsTypes = {

    data: void | ApiDefaultResult[],
    currentQueryValue?: string

}

export const revalidate = 1800 // revalidate cached data every 30 min

const showUpItemVariant = {

    initial: { opacity: 0 },
    animate: { opacity: 1 }

}

function MediaRankingSection(props: PropsTypes) {

    const [mediaList, setMediaList] = useState<ApiDefaultResult[] | null>(props.data as ApiDefaultResult[])
    const [loading, setLoading] = useState<boolean>(false)

    const [showAdultContent, setShowAdultContent] = useState<boolean | null>(null)
    const [currentQueryValue, setCurrentQueryValue] = useState<"ANIME" | "MANGA">("ANIME")

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    // request new type of media then set them
    const loadMedia: (parameter: "ANIME" | "MANGA") => void = async (parameter: "ANIME" | "MANGA") => {

        setLoading(true)

        let docUserShowAdultContent = showAdultContent || false

        if (user && showAdultContent == null) {

            docUserShowAdultContent = await getDoc(doc(db, 'users', user!.uid)).then(doc => doc.get("showAdultContent"))

            setShowAdultContent(docUserShowAdultContent)

        }

        const response = await anilist.getMediaForThisFormat(parameter, undefined, undefined, undefined, docUserShowAdultContent) as ApiDefaultResult[]

        setCurrentQueryValue(parameter)

        setMediaList(response as ApiDefaultResult[])

        setLoading(false)

    }

    return (
        <div id={styles.rank_container}>

            <div className={styles.title_navbar_container}>

                <h3>Top 10 This Week</h3>

                <NavButtons
                    functionReceived={loadMedia as (parameter: string | number) => void}
                    actualValue={currentQueryValue} options={[
                        { name: "Animes", value: "ANIME" }, { name: "Mangas", value: "MANGA" }
                    ]}
                />

            </div>

            <motion.ol data-loading={loading}>

                <AnimatePresence>

                    {loading && (
                        simulateRange(10).map((item, key) => (
                            <motion.span key={key}
                                className={styles.loading_span}
                                variants={showUpItemVariant}
                                initial="initial"
                                animate="animate"
                                exit="initial"
                            />
                        ))
                    )}
                    
                    {(!loading && mediaList) && mediaList!.slice(0, 10).map((item: ApiDefaultResult, key: number) => (
                        <MediaListCoverInfo2 key={key} positionIndex={key + 1} data={item} showCoverArt={false} variants={showUpItemVariant} />
                    ))}

                </AnimatePresence>

            </motion.ol>

        </div>
    )

}

export default MediaRankingSection