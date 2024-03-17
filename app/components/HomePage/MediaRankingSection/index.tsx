"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo from '../../MediaItemCoverInfo2'
import NavButtons from '../../NavButtons'
import { ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import API from "@/api/anilist"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/firebase/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

type PropsTypes = {

    data: void | ApiDefaultResult[],
    currentQueryValue?: string

}

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

        const response: ApiDefaultResult[] | void = await API.getMediaForThisFormat(parameter, undefined, undefined, undefined, showAdultContent)

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
                    <MediaListCoverInfo key={key} positionIndex={key + 1} data={item} showCoverArt={false} />
                ))}
            </ol>

        </div>
    )

}

export default MediaRankingSection