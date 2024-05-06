"use client"
import React, { useEffect, useState } from 'react'
import styles from "./component.module.css"
import MediaListCoverInfo2 from '../../MediaCards/MediaCover2'
import CoverWithMediaInfo from '../../MediaCards/CoverWithMediaInfo'
import NavButtons from '../../NavButtons'
import { ApiAiringMidiaResults, ApiDefaultResult } from '@/app/ts/interfaces/apiAnilistDataInterface'
import anilist from "@/app/api/anilist"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getAuth } from 'firebase/auth'
import { initFirebase } from '@/app/firebaseApp'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

type PropsTypes = {

    data: ApiDefaultResult[],
    currentQueryValue?: string

}

export const revalidate = 1800 // revalidate the data every 30 min

function NewestMediaSection(props: PropsTypes) {

    const [mediaList, setMediaList] = useState<ApiAiringMidiaResults[] | ApiDefaultResult[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [showAdultContent, setShowAdultContent] = useState<boolean | null>(null)

    const auth = getAuth()
    const [user] = useAuthState(auth)

    const db = getFirestore(initFirebase())

    let { data } = props
    let currentQueryValue = 1 //stands for 1 day (today)

    // request new type of media then set them
    const loadMedia: (parameter: 1 | 7 | 30) => void = async (parameter: 1 | 7 | 30) => {
        console.log(`Received parameter: ${parameter}`);

        getMediaByDaysRange(parameter)

    }

    // gets the range of days than parse it to unix, runs function to get any media releasing in the selected range
    async function getMediaByDaysRange(days: 1 | 7 | 30) {

        let docUserShowAdultContent = showAdultContent || false

        if (user && showAdultContent == null) {

            docUserShowAdultContent = await getDoc(doc(db, 'users', user!.uid)).then(doc => doc.get("showAdultContent"))

            setShowAdultContent(docUserShowAdultContent)

        }

        currentQueryValue = days

        setIsLoading(true)

        const response = await anilist.getReleasingByDaysRange("ANIME", days, undefined, 11, docUserShowAdultContent).then(
            res => ((res as ApiAiringMidiaResults[]).sort((a, b) => a.media.popularity - b.media.popularity).reverse())
        ).then(res => res.map((item) => item.media))

        setMediaList(response)

        setIsLoading(false)

    }

    useEffect(() => {
        if (data[0] == null || data[0] == undefined) {
            getMediaByDaysRange(30)
        }
        else {
            setMediaList(data)
            setIsLoading(false)
        }
    }, [currentQueryValue])

    return (
        <div id={styles.newest_conteiner}>

            <div className={styles.title_navbar_container}>

                <h3>Newest Animes Episodes</h3>

                <NavButtons
                    functionReceived={loadMedia as (parameter: string | number) => void}
                    actualValue={data[0] == null || data[0] == undefined ? 30 : currentQueryValue}
                    options={[
                        { name: "Today", value: 1 }, { name: "This week", value: 7 }, { name: "Last 30 days", value: 30 }
                    ]} />

            </div>

            <ul>
                {!isLoading && (
                    <>
                        <li>
                            {(mediaList[0] != undefined) ? (
                                <CoverWithMediaInfo data={(mediaList as ApiDefaultResult[])[0]} />
                            ) : (
                                <p>No results for today</p>
                            )}
                        </li>

                        {(mediaList as ApiDefaultResult[]).slice(1, 11).map((item, key: number) => (
                            <MediaListCoverInfo2 key={key} positionIndex={key + 1} data={item} showCoverArt={true} alternativeBorder={true} />
                        ))}
                    </>
                )}
            </ul>

        </div>
    )
}

export default NewestMediaSection