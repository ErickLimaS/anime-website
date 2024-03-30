"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo2 from '../../MediaItemCoverInfo2'
import NavButtons from '../../NavButtons'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from "@/api/anilist"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/firebase/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

type PropsTypes = {

    data: void | ApiDefaultResult[],
    currentQueryValue?: string

}

export const revalidate = 1800 // revalidate cached data every 30 min

function MediaRankingSection(props: PropsTypes) {

    const [mediaList, setMediaList] = useState<ApiDefaultResult[] | ApiDefaultResult | null>(null)

    let { data } = props
    let currentQueryValue = "ANIME"

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    useEffect(() => {
        setMediaList(data as ApiDefaultResult[])
    }, [])

    // request new type of media then set them
    const loadMedia: (parameter: string) => void = async (parameter: string) => {

        let showAdultContent = false

        if (user) {

            showAdultContent = await getDoc(doc(db, 'users', user!.uid)).then(doc => doc.get("showAdultContent"))

        }

        const response = await anilist.getMediaForThisFormat(parameter, undefined, undefined, undefined, showAdultContent) as ApiDefaultResult[]

        currentQueryValue = parameter

        setMediaList(response as ApiDefaultResult[])

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

            <ol>
                {((mediaList as ApiDefaultResult[]) || (data as ApiDefaultResult[])).slice(0, 10).map((item: ApiDefaultResult, key: number) => (
                    <MediaListCoverInfo2 key={key} positionIndex={key + 1} data={item} showCoverArt={false} />
                ))}
            </ol>

        </div>
    )

}

export default MediaRankingSection